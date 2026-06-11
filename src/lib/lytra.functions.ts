import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createGeminiProvider } from "./ai-gateway.server";
import { generateText } from "ai";
import { z } from "zod";

const SYSTEM_VOICE = `Você é a Lytra — uma inteligência acolhedora, estratégica e direta que ajuda pessoas a
reduzir vícios, recuperar foco e reconstruir rotina. Sua voz é calma, humana, profunda e nunca
genérica nem coachzinho motivacional. Você escreve em português do Brasil, frases curtas, sem
clichês, sem emojis em excesso (no máximo 1 quando fizer sentido). Você nunca diagnostica nem
substitui profissional de saúde. Você reconhece a dor antes de propor ação. Sempre termina com
um próximo passo concreto e pequeno.`;

function getModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY ausente");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return createGeminiProvider(key)(model);
}

/**
 * Geração de texto resiliente: se a IA falhar (chave ausente, rede, quota, etc.),
 * retorna um fallback humano e seguro em vez de derrubar a requisição.
 * Garante que onboarding, diário e SOS continuem funcionando sem o Gemini.
 */
async function generateTextSafe(prompt: string, fallback: string): Promise<string> {
  try {
    const { text } = await generateText({ model: getModel(), system: SYSTEM_VOICE, prompt });
    const clean = (text ?? "").trim();
    return clean || fallback;
  } catch (e: any) {
    console.error("[ia] generateText falhou; usando fallback:", e?.message);
    return fallback;
  }
}

const FALLBACK_PLAN = `Reconheço que dar o primeiro passo já é difícil — e você deu. Isso já conta.

Nos próximos 30 dias o foco é simples: reduzir os gatilhos aos poucos e criar pequenas vitórias diárias. Sem radicalismo, um passo de cada vez.

Comece hoje com algo pequeno: deixe o celular fora de alcance por 30 minutos antes de dormir.`;

const FALLBACK_JOURNAL = `Obrigado por escrever — colocar em palavras já é um passo importante. O que você trouxe faz sentido e merece atenção. Quando puder, escolha uma única coisa pequena para fazer agora, sem cobrança. Voltar aqui amanhã já é uma vitória.`;

const FALLBACK_SOS = `Esse impulso parece enorme agora, e tudo bem sentir isso. Ele sobe, mas também passa.

Faça isto pelos próximos 90 segundos: levante, beba um copo de água devagar e respire fundo 5 vezes, contando cada expiração até o fim.

Você não precisa vencer o dia inteiro — só os próximos 10 minutos. E esses, você consegue.`;

const FALLBACK_TASKS = [
  { title: "30 minutos sem celular", description: "Coloque o celular em outro cômodo. Respire.", category: "gatilho" },
  { title: "Caminhada curta de 10 min", description: "Saia, sinta o ar, volte.", category: "fisica" },
  { title: "Reflexão de 3 linhas", description: "Escreva no diário como você se sente agora.", category: "reflexao" },
  { title: "Respiração 4-7-8", description: "Inspire 4s, segure 7s, expire 8s. Repita 4 vezes.", category: "mental" },
];

/* ============================================================
   ONBOARDING
   ============================================================ */
const OnboardingInput = z.object({
  habit: z.string().min(1).max(100),
  intensity: z.number().int().min(1).max(5),
  triggers: z.array(z.string().max(80)).max(20),
  critical_hours: z.array(z.string().max(40)).max(20),
  goal: z.string().max(500),
  current_feeling: z.string().max(500),
  biggest_obstacle: z.string().max(500),
  time_lost: z.string().max(120),
  vision_30_days: z.string().max(500),
});

/**
 * Validates that open-text answers contain meaningful content.
 * Blocks:
 *   - strings under a meaningful word count
 *   - keyboard-mash / random sequences (no vowels or no spaces in long strings)
 *   - pure repetition ("aaaa", "asdf asdf", "teste teste teste")
 *   - strings with fewer than 2 distinct words
 */
function validateAnswerQuality(value: string, fieldName: string, minWords = 2): void {
  const trimmed = value.trim();
  if (!trimmed) return; // empty already blocked by zod min

  // Must have at least minWords recognisable tokens
  const words = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  if (words.length < minWords) {
    throw new Error(
      `Não foi possível gerar seu plano com essas respostas. Responda o campo "${fieldName}" com mais detalhes para que a Lytra consiga entender sua rotina e seus desafios.`,
    );
  }

  // Must contain at least one vowel (rules out pure consonant mash)
  if (!/[aeiouáéíóúâêîôûãõ]/i.test(trimmed)) {
    throw new Error(
      `Não foi possível gerar seu plano com essas respostas. Responda o campo "${fieldName}" com palavras reais.`,
    );
  }

  // Detect pure repetition: take all unique words; if the ratio of unique to total is < 0.4 and total > 4, it's repetitive
  const uniqueWords = new Set(words);
  if (words.length > 4 && uniqueWords.size / words.length < 0.4) {
    throw new Error(
      `Não foi possível gerar seu plano com essas respostas. Evite repetições no campo "${fieldName}" e descreva sua situação com suas próprias palavras.`,
    );
  }

  // Detect keyboard mash in long words (word > 7 chars with no recognisable vowel clusters)
  const longWords = words.filter((w) => w.length > 7);
  const mashCount = longWords.filter((w) => !/[aeiouáéíóúâêîôûãõ]{1}/i.test(w)).length;
  if (mashCount > 0 && mashCount >= longWords.length * 0.6) {
    throw new Error(
      `Não foi possível gerar seu plano com essas respostas. Parece que o campo "${fieldName}" contém texto sem sentido. Por favor, descreva sua situação real.`,
    );
  }
}

export const submitOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => OnboardingInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // --- Idempotency: do NOT overwrite an existing plan ---
    const { data: existing } = await supabase
      .from("onboarding")
      .select("user_id, ai_plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing?.ai_plan) {
      // Plan already generated — mark as onboarded in case it wasn't and return existing
      await supabase.from("profiles").update({ onboarded: true }).eq("id", userId);
      return { plan: existing.ai_plan };
    }

    // --- Validate answer quality before calling the AI ---
    const openFields: [string, string, number][] = [
      [data.goal, "Objetivo", 2],
      [data.current_feeling, "Como você se sente", 2],
      [data.biggest_obstacle, "Maior obstáculo", 2],
      [data.vision_30_days, "Visão em 30 dias", 3],
    ];
    for (const [value, label, minWords] of openFields) {
      if (value.trim()) validateAnswerQuality(value, label, minWords);
    }

    const prompt = `Construa um plano inicial de reconstrução para uma pessoa.
Hábito a reduzir: ${data.habit}
Intensidade (1-5): ${data.intensity}
Gatilhos: ${data.triggers.join(", ") || "—"}
Horários críticos: ${data.critical_hours.join(", ") || "—"}
Objetivo: ${data.goal}
Sentimento atual: ${data.current_feeling}
Maior obstáculo: ${data.biggest_obstacle}
Tempo perdido: ${data.time_lost}
Visão em 30 dias: ${data.vision_30_days}

Escreva em 3 parágrafos curtos: (1) reconhecimento humano do contexto, (2) estratégia central
para os próximos 30 dias, (3) o primeiro passo de hoje. Sem listas, sem títulos.`;

    const text = await generateTextSafe(prompt, FALLBACK_PLAN);

    await supabase.from("onboarding").upsert({
      user_id: userId,
      habit: data.habit,
      intensity: data.intensity,
      triggers: data.triggers,
      critical_hours: data.critical_hours,
      goal: data.goal,
      current_feeling: data.current_feeling,
      biggest_obstacle: data.biggest_obstacle,
      time_lost: data.time_lost,
      vision_30_days: data.vision_30_days,
      ai_plan: text,
      updated_at: new Date().toISOString(),
    });

    // Only mark onboarded AFTER plan is successfully saved
    await supabase.from("profiles").update({ onboarded: true }).eq("id", userId);

    // Generate today's tasks (with fallback if AI fails)
    await generateTasksFor(supabase, userId, data.habit, data.triggers);

    return { plan: text };
  });

/* ============================================================
   GERAÇÃO DE TAREFAS DIÁRIAS
   ============================================================ */
async function generateTasksFor(
  supabase: any,
  userId: string,
  habit: string,
  triggers: string[],
) {
  const prompt = `Gere 4 micro-tarefas para hoje, para alguém reduzindo "${habit}".
Gatilhos comuns: ${triggers.join(", ") || "—"}.
Cada tarefa deve ser concreta, leve, executável em até 15 minutos, e variar entre:
ação física, redução de gatilho, exercício mental e reflexão.
Responda APENAS em JSON válido, array com objetos { "title": string, "description": string, "category": "fisica"|"gatilho"|"mental"|"reflexao" }.
Sem markdown, sem texto fora do JSON.`;

  // Geração resiliente: se a IA falhar ou o JSON vier inválido, usa o fallback.
  let tasks: { title: string; description: string; category: string }[] = [];
  try {
    const { text } = await generateText({ model: getModel(), system: SYSTEM_VOICE, prompt });
    const cleaned = (text ?? "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) tasks = parsed;
  } catch (e: any) {
    console.error("[ia] geração de tarefas falhou; usando fallback:", e?.message);
  }
  if (!Array.isArray(tasks) || tasks.length === 0) tasks = [...FALLBACK_TASKS];

  const rows = tasks.slice(0, 5).map((t) => ({
    user_id: userId,
    title: String(t.title).slice(0, 200),
    description: String(t.description ?? "").slice(0, 500),
    category: String(t.category ?? "mental").slice(0, 40),
  }));
  await supabase.from("daily_tasks").insert(rows);
}

export const regenerateTodayTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: onb } = await supabase
      .from("onboarding")
      .select("habit, triggers")
      .eq("user_id", userId)
      .maybeSingle();
    if (!onb) throw new Error("Onboarding não encontrado");
    const today = new Date().toISOString().slice(0, 10);
    // Remove apenas as tarefas ainda NÃO concluídas do dia, preservando o histórico.
    await supabase
      .from("daily_tasks")
      .delete()
      .eq("user_id", userId)
      .eq("task_date", today)
      .eq("completed", false);
    await generateTasksFor(supabase, userId, onb.habit, onb.triggers ?? []);
    return { ok: true };
  });

/**
 * Quando todas as tarefas do dia forem concluídas, gera 4 tarefas
 * complementares — mantendo as concluídas visíveis no histórico do dia.
 */
export const appendMoreTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);

    // Só adiciona se TODAS as atuais estiverem concluídas (segurança server-side)
    const { data: current } = await supabase
      .from("daily_tasks")
      .select("id, completed")
      .eq("user_id", userId)
      .eq("task_date", today);

    if (!current || current.length === 0) return { added: 0 };
    const allDone = current.every((t: any) => t.completed);
    if (!allDone) return { added: 0 };

    const { data: onb } = await supabase
      .from("onboarding")
      .select("habit, triggers")
      .eq("user_id", userId)
      .maybeSingle();

    await generateTasksFor(supabase, userId, onb?.habit ?? "um hábito", onb?.triggers ?? []);
    return { added: 4 };
  });

/**
 * Histórico de tarefas concluídas dos últimos 30 dias.
 */
export const getTaskHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase
      .from("daily_tasks")
      .select("id, title, description, category, task_date, completed_at")
      .eq("user_id", userId)
      .eq("completed", true)
      .gte("task_date", since)
      .order("completed_at", { ascending: false });
    return { tasks: data ?? [] };
  });

export const toggleTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), completed: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("daily_tasks")
      .update({
        completed: data.completed,
        completed_at: data.completed ? new Date().toISOString() : null,
      })
      .eq("id", data.id)
      .eq("user_id", userId);

    // Atualiza XP e streak quando completa
    if (data.completed) {
      const { data: p } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      const today = new Date().toISOString().slice(0, 10);
      const last = p?.last_active_date as string | null;
      let streak = p?.current_streak ?? 0;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        streak = last === yesterday ? streak + 1 : 1;
      }
      const xp = (p?.xp ?? 0) + 10;
      const level = Math.max(1, Math.floor(xp / 100) + 1);
      await supabase
        .from("progress")
        .update({
          xp,
          level,
          current_streak: streak,
          best_streak: Math.max(p?.best_streak ?? 0, streak),
          last_active_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    }
    return { ok: true };
  });

/* ============================================================
   DIÁRIO EMOCIONAL
   ============================================================ */
export const submitJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      content: z.string().min(1).max(4000),
      mood: z.number().int().min(1).max(5).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: onb } = await supabase
      .from("onboarding")
      .select("habit, goal")
      .eq("user_id", userId)
      .maybeSingle();

    const text = await generateTextSafe(
      `Contexto do usuário: trabalhando em reduzir "${onb?.habit ?? "um hábito"}". Objetivo: ${onb?.goal ?? "—"}.
Entrada do diário:
"""
${data.content}
"""
Responda em até 4 frases. Reconheça o que está sendo dito antes de qualquer sugestão.
Sem clichê, sem "respira fundo". Se houver padrão de gatilho, aponte com clareza.
Termine com um próximo passo pequeno e concreto.`,
      FALLBACK_JOURNAL,
    );

    const { data: row, error } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, content: data.content, mood: data.mood, ai_response: text })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/* ============================================================
   MODO EMERGÊNCIA
   ============================================================ */
export const emergencyResponse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ context: z.string().max(500).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: onb } = await supabase
      .from("onboarding")
      .select("habit, triggers")
      .eq("user_id", userId)
      .maybeSingle();

    const text = await generateTextSafe(
      `O usuário está prestes a recair em "${onb?.habit ?? "um hábito"}".
Contexto que ele escreveu: ${data.context || "(nada)"}.
Gere uma resposta de 3 partes, separadas por linha em branco:
1) Uma frase curta de reconhecimento — sem julgamento.
2) Uma ação física de 90 segundos para interromper o impulso (concreta, fácil agora).
3) Uma frase final, estratégica, que devolva o poder pra ele.
Sem títulos, sem listas numeradas.`,
      FALLBACK_SOS,
    );

    return { message: text };
  });

export const registerRelapse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      context: z.string().max(500).optional(),
      trigger: z.string().max(120).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("relapses").insert({
      user_id: userId,
      context: data.context,
      trigger: data.trigger,
    });
    await supabase
      .from("progress")
      .update({ current_streak: 0, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    return { ok: true };
  });

/* ============================================================
   DASHBOARD
   ============================================================ */
export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);

    const [profile, onb, tasks, progress, todayMood, journal, relapses, subscription, roleRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("onboarding").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("daily_tasks").select("*").eq("user_id", userId).eq("task_date", today).order("created_at"),
      supabase.from("progress").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("mood_checkins").select("*").eq("user_id", userId).eq("checkin_date", today).maybeSingle(),
      supabase.from("journal_entries").select("id, content, ai_response, created_at, mood").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("relapses").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
      supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    ]);

    return {
      profile: profile.data,
      onboarding: onb.data,
      tasks: tasks.data ?? [],
      progress: progress.data,
      todayMood: todayMood.data,
      journal: journal.data ?? [],
      relapses: relapses.data ?? [],
      subscription: subscription.data,
      isAdmin: !!roleRes.data,
    };
  });

export const submitMood = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ mood: z.number().int().min(1).max(5), note: z.string().max(300).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("mood_checkins")
      .upsert({ user_id: userId, checkin_date: today, mood: data.mood, note: data.note });
    return { ok: true };
  });
