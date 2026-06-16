import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
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
    const { userId } = context;
    console.log("[submitOnboarding] started userId=", userId);

    // Verify service_role key is set and looks correct (starts with eyJ, much longer than anon key)
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
    if (!svcKey) {
      console.error("[submitOnboarding] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set in environment");
      throw new Error("Configuração do servidor incompleta. Contate o suporte.");
    }
    if (svcKey === anonKey) {
      console.error("[submitOnboarding] CRITICAL: SUPABASE_SERVICE_ROLE_KEY equals SUPABASE_PUBLISHABLE_KEY — wrong key configured");
      throw new Error("Configuração do servidor incorreta. Contate o suporte.");
    }
    // Log partial key for verification without exposing the full secret
    console.log("[submitOnboarding] service_role key prefix=", svcKey.slice(0, 20), "length=", svcKey.length);

    // Use service_role client for all writes — bypasses RLS
    const db = supabaseAdmin;
    console.log("[submitOnboarding] using supabaseAdmin (service_role)");

    // --- Idempotency: do NOT overwrite an existing plan ---
    const { data: existing, error: existErr } = await db
      .from("onboarding")
      .select("user_id, ai_plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (existErr) console.error("[submitOnboarding] existing check error:", existErr.message);

    if (existing?.ai_plan) {
      console.log("[submitOnboarding] plan already exists, updating onboarded and returning");
      // Step 1: plain UPDATE — does NOT insert, only updates existing row
      const { data: updateData, error: updateErr, count: updateCount } = await db
        .from("profiles")
        .update({ onboarded: true, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select("id, onboarded");
      console.log("[submitOnboarding] existing_plan_update_result", {
        data: JSON.stringify(updateData),
        error: updateErr?.message ?? null,
        count: updateCount,
      });
      if (updateErr) {
        console.error("[submitOnboarding] existing_plan_update_error:", updateErr.message, updateErr.code);
        throw new Error(`Erro ao atualizar perfil: ${updateErr.message}`);
      }
      // Step 2: verify with a fresh SELECT
      const { data: verifyData, error: verifyErr } = await db
        .from("profiles")
        .select("id, onboarded")
        .eq("id", userId)
        .maybeSingle();
      console.log("[submitOnboarding] existing_plan_verify_result", {
        data: JSON.stringify(verifyData),
        error: verifyErr?.message ?? null,
      });
      if (verifyErr) {
        console.error("[submitOnboarding] existing_plan_verify_error:", verifyErr.message);
        throw new Error(`Erro ao verificar perfil: ${verifyErr.message}`);
      }
      if (!verifyData?.onboarded) {
        console.error("[submitOnboarding] existing_plan_onboarded_still_false after update+verify — data:", JSON.stringify(verifyData), "updateData:", JSON.stringify(updateData));
        throw new Error("Não foi possível confirmar conclusão do onboarding. Tente novamente.");
      }
      console.log("[submitOnboarding] existing_plan_onboarded_confirmed=true");
      return { ok: true, plan: existing.ai_plan };
    }

    // --- Validate answer quality before calling the AI ---
    console.log("[submitOnboarding] validation_passed");
    const openFields: [string, string, number][] = [
      [data.goal, "Objetivo", 2],
      [data.current_feeling, "Como você se sente", 2],
      [data.biggest_obstacle, "Maior obstáculo", 2],
      [data.vision_30_days, "Visão em 30 dias", 3],
    ];
    for (const [value, label, minWords] of openFields) {
      if (value.trim()) validateAnswerQuality(value, label, minWords);
    }

    // --- Generate plan text ---
    console.log("[submitOnboarding] gemini_request_started");
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
    console.log("[submitOnboarding] gemini_request_success plan_length=", text.length);

    // --- Save plan (service_role → bypasses RLS) ---
    console.log("[submitOnboarding] plan_save_started");
    const { error: upsertErr } = await db.from("onboarding").upsert({
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

    if (upsertErr) {
      console.error("[submitOnboarding] plan_save_error:", upsertErr.message, upsertErr.code);
      throw new Error(`Erro ao salvar plano: ${upsertErr.message}`);
    }
    console.log("[submitOnboarding] plan_save_success");

    // --- Mark onboarded AFTER plan saved ---
    console.log("[submitOnboarding] profile_update_started userId=", userId);
    const { data: profileUpdateData, error: profileErr } = await db
      .from("profiles")
      .update({ onboarded: true, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("id, onboarded");

    console.log("[submitOnboarding] profile_update_result data=", JSON.stringify(profileUpdateData), "error=", profileErr?.message ?? null, "code=", profileErr?.code ?? null);

    if (profileErr) {
      console.error("[submitOnboarding] profile_update_error:", profileErr.message, profileErr.code);
      throw new Error(`Erro ao marcar onboarding: ${profileErr.message}`);
    }

    // Verify with a fresh SELECT after update
    const { data: profileVerifyData, error: profileVerifyErr } = await db
      .from("profiles")
      .select("id, onboarded")
      .eq("id", userId)
      .maybeSingle();
    console.log("[submitOnboarding] profile_verify_result data=", JSON.stringify(profileVerifyData), "error=", profileVerifyErr?.message ?? null);

    if (profileVerifyErr) {
      console.error("[submitOnboarding] profile_verify_error:", profileVerifyErr.message);
    } else if (!profileVerifyData?.onboarded) {
      console.error("[submitOnboarding] profile_still_false after update+verify — updateData:", JSON.stringify(profileUpdateData), "verifyData:", JSON.stringify(profileVerifyData));
    } else {
      console.log("[submitOnboarding] profile_onboarded_confirmed=true");
    }

    // --- Generate today's tasks (best-effort, never blocks the flow) ---
    try {
      await generateTasksFor(db, userId, data.habit, data.triggers);
      console.log("[submitOnboarding] tasks_generated");
    } catch (taskErr: any) {
      console.error("[submitOnboarding] tasks_generation_error (non-fatal):", taskErr?.message);
    }

    console.log("[submitOnboarding] finished ok");
    return { ok: true, plan: text };
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

  // Geração resiliente: getModel() can throw if GEMINI_API_KEY absent; catch all.
  let tasks: { title: string; description: string; category: string }[] = [];
  try {
    const model = getModel(); // can throw if key absent — caught below
    const { text } = await generateText({ model, system: SYSTEM_VOICE, prompt });
    const cleaned = (text ?? "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) tasks = parsed;
  } catch (e: any) {
    console.error("[generateTasksFor] falhou; usando fallback:", e?.message);
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
    const today = new Date().toISOString().slice(0, 10);

    // If all tasks are already completed, don't reset — day is done
    const { data: current } = await supabase
      .from("daily_tasks")
      .select("id, completed")
      .eq("user_id", userId)
      .eq("task_date", today);

    if (current && current.length > 0 && current.every((t: any) => t.completed)) {
      console.log("[daily_mission] regenerate skipped — all tasks already completed for today");
      return { ok: true, skipped: true, reason: "all_done" };
    }

    // Remove only uncompleted tasks — preserve completed ones
    await supabase
      .from("daily_tasks")
      .delete()
      .eq("user_id", userId)
      .eq("task_date", today)
      .eq("completed", false);

    const { data: onb } = await supabase
      .from("onboarding")
      .select("habit, triggers")
      .eq("user_id", userId)
      .maybeSingle();

    const habit = onb?.habit ?? "foco e disciplina";
    const triggers: string[] = onb?.triggers ?? [];
    console.log("[daily_mission] regenerate userId=", userId, "onboarding_found=", Boolean(onb), "using_fallback=", !onb);

    await generateTasksFor(supabase, userId, habit, triggers);
    return { ok: true, skipped: false };
  });

/**
 * Garante que existam tarefas geradas para o dia atual.
 * Se já existirem (qualquer quantidade), retorna sem fazer nada.
 * Se não existirem, gera automaticamente — chamado na abertura do app.
 * Nunca falha: usa fallback quando dados do onboarding não estão disponíveis.
 */
export const ensureTodayTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);

    // Check if tasks already exist for today
    const { data: existing } = await supabase
      .from("daily_tasks")
      .select("id")
      .eq("user_id", userId)
      .eq("task_date", today)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("[daily_mission] ensure userId=", userId, "tasks_already_exist=true");
      return { generated: false, reason: "tasks_already_exist" };
    }

    // No tasks yet — look up onboarding data (optional, fallback used if absent)
    const { data: onb, error: onbErr } = await supabase
      .from("onboarding")
      .select("habit, triggers")
      .eq("user_id", userId)
      .maybeSingle();

    const habit = onb?.habit ?? "foco e disciplina";
    const triggers: string[] = onb?.triggers ?? [];
    const usingFallback = !onb;

    console.log("[daily_mission] ensure userId=", userId, "onboarding_found=", Boolean(onb), "using_fallback=", usingFallback, "onb_err=", onbErr?.message ?? null);

    await generateTasksFor(supabase, userId, habit, triggers);
    return { generated: true, used_fallback: usingFallback };
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
    // Return ALL tasks from last 30 days (completed + pending) so Histórico
    // can group by day and show full-day completion status.
    const { data } = await supabase
      .from("daily_tasks")
      .select("id, title, description, category, task_date, completed, completed_at")
      .eq("user_id", userId)
      .gte("task_date", since)
      .order("task_date", { ascending: false })
      .order("created_at", { ascending: true });
    return { tasks: data ?? [] };
  });

/* ============================================================
   LEVEL / XP HELPERS — defined here so toggleTask can use them
   ============================================================ */

// Thresholds de XP por nível (índice = nível - 1)
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3700, 4700];

export function calcLevel(xp: number): number {
  let lvl = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
    else break;
  }
  return Math.min(lvl, LEVEL_THRESHOLDS.length);
}

export function xpForNextLevel(currentXp: number): { current: number; next: number; needed: number; pct: number } {
  const lvl = calcLevel(currentXp);
  const currentThreshold = LEVEL_THRESHOLDS[lvl - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[lvl] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const range = nextThreshold - currentThreshold;
  const earned = currentXp - currentThreshold;
  return {
    current: currentXp,
    next: nextThreshold,
    needed: Math.max(0, nextThreshold - currentXp),
    pct: range > 0 ? Math.min(100, Math.round((earned / range) * 100)) : 100,
  };
}

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
      const level = calcLevel(xp);
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
   GAMIFICAÇÃO — completeDailyMission
   Chamado quando o usuário conclui TODAS as tarefas do dia.
   - Concede +50 XP bônus (uma vez por dia, idempotente)
   - Atualiza streak / best_streak
   - Recalcula nível com thresholds progressivos
   - Verifica conquistas desbloqueadas
   - Retorna dados frescos para o frontend atualizar imediatamente
   ============================================================ */

// Achievement definitions — key must match user_achievements.achievement_key
const ACHIEVEMENT_DEFS = [
  { key: "first_mission",    label: "Primeiro passo",       check: (p: any) => p.total_days_completed >= 1 },
  { key: "streak_3",         label: "Constância inicial",   check: (p: any) => p.current_streak >= 3 },
  { key: "streak_7",         label: "Semana completa",      check: (p: any) => p.current_streak >= 7 },
  { key: "tasks_10",         label: "Foco em construção",   check: (p: any) => p.total_tasks_completed >= 10 },
  { key: "tasks_25",         label: "Controle crescente",   check: (p: any) => p.total_tasks_completed >= 25 },
  { key: "level_2",          label: "Nível 2 alcançado",    check: (p: any) => p.level >= 2 },
  { key: "level_5",          label: "Nível 5 alcançado",    check: (p: any) => p.level >= 5 },
];

export const completeDailyMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);

    console.log("[gamification] complete_start", { userId, today });

    // Check idempotency — already completed today?
    const { data: existing, error: existErr } = await supabaseAdmin
      .from("daily_completions")
      .select("id, xp_awarded")
      .eq("user_id", userId)
      .eq("completed_date", today)
      .maybeSingle();

    if (existErr) {
      // Table may not exist yet (migration not applied) — log but don't crash
      console.error("[gamification] complete_error checking daily_completions:", existErr.message, existErr.code);
    }

    const alreadyCompleted = !!existing;
    console.log("[gamification] already_completed=", alreadyCompleted);

    // Fetch current progress
    const { data: p } = await supabaseAdmin
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const currentXp = p?.xp ?? 0;
    const currentLevel = p?.level ?? 1;
    const currentStreak = p?.current_streak ?? 0;
    const bestStreak = p?.best_streak ?? 0;
    const totalDays = (p?.total_days_completed as number) ?? 0;
    const totalTasks = (p?.total_tasks_completed as number) ?? 0;

    console.log("[gamification] xp_before=", currentXp, "level_before=", currentLevel, "streak_before=", currentStreak);

    // Count today's completed tasks
    const { data: todayTasks } = await supabaseAdmin
      .from("daily_tasks")
      .select("id")
      .eq("user_id", userId)
      .eq("task_date", today)
      .eq("completed", true);
    const todayTaskCount = todayTasks?.length ?? 0;

    let xpGained = 0;
    let newXp = currentXp;
    let newStreak = currentStreak;
    let newTotalDays = totalDays;
    let newTotalTasks = totalTasks;

    if (!alreadyCompleted) {
      xpGained = 50;
      newXp = currentXp + 50;

      const last = p?.last_active_date as string | null;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (last === yesterday) newStreak = currentStreak + 1;
      else if (last === today) newStreak = currentStreak;
      else newStreak = 1;

      newTotalDays = totalDays + 1;
      newTotalTasks = totalTasks + todayTaskCount;

      // Insert completion record — use upsert to handle race conditions safely
      const { error: insertErr } = await supabaseAdmin
        .from("daily_completions")
        .upsert(
          { user_id: userId, completed_date: today, xp_awarded: 50 },
          { onConflict: "user_id,completed_date", ignoreDuplicates: true },
        );
      if (insertErr) {
        console.error("[gamification] daily_completions insert error:", insertErr.message, insertErr.code);
        // If table doesn't exist, still continue — XP will be updated below
      }
    } else {
      const last = p?.last_active_date as string | null;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      newStreak = last === yesterday ? currentStreak + 1 : last === today ? currentStreak : 1;
    }

    const newLevel = calcLevel(newXp);
    const newBestStreak = Math.max(bestStreak, newStreak);

    console.log("[gamification] xp_after=", newXp, "level_after=", newLevel, "streak_after=", newStreak);

    if (!alreadyCompleted) {
      const { error: progressErr } = await supabaseAdmin
        .from("progress")
        .update({
          xp: newXp,
          level: newLevel,
          current_streak: newStreak,
          best_streak: newBestStreak,
          last_active_date: today,
          total_days_completed: newTotalDays,
          total_tasks_completed: newTotalTasks,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
      if (progressErr) {
        console.error("[gamification] progress update error:", progressErr.message);
      }
    }

    // Check achievements
    const { data: existingAchievements } = await supabaseAdmin
      .from("user_achievements")
      .select("achievement_key")
      .eq("user_id", userId);
    const earned = new Set((existingAchievements ?? []).map((a: any) => a.achievement_key));

    const updatedProgress = {
      xp: newXp, level: newLevel,
      current_streak: newStreak, best_streak: newBestStreak,
      total_days_completed: newTotalDays, total_tasks_completed: newTotalTasks,
    };

    const newlyUnlocked: string[] = [];
    for (const def of ACHIEVEMENT_DEFS) {
      if (!earned.has(def.key) && def.check(updatedProgress)) {
        newlyUnlocked.push(def.key);
        await supabaseAdmin
          .from("user_achievements")
          .upsert(
            { user_id: userId, achievement_key: def.key },
            { onConflict: "user_id,achievement_key", ignoreDuplicates: true },
          );
      }
    }

    const unlockedLabels = newlyUnlocked.map(
      (k) => ACHIEVEMENT_DEFS.find((d) => d.key === k)?.label ?? k,
    );

    console.log("[gamification] achievements_unlocked=", unlockedLabels);

    return {
      alreadyCompleted,
      xpGained,
      totalXp: newXp,
      level: newLevel,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      xpProgress: xpForNextLevel(newXp),
      unlockedAchievements: unlockedLabels,
    };
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

    console.log("[daily_mission] dashboard_load_start", { userId, today });

    // Fetch everything in parallel — including daily_completions to check if today is done
    const [profile, onb, tasksRes, progress, todayMood, journal, relapses, subscription, roleRes, achievements, todayCompletion] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("onboarding").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("daily_tasks").select("*").eq("user_id", userId).eq("task_date", today).order("created_at"),
      supabase.from("progress").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("mood_checkins").select("*").eq("user_id", userId).eq("checkin_date", today).maybeSingle(),
      supabase.from("journal_entries").select("id, content, ai_response, created_at, mood").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      supabase.from("relapses").select("created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
      supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.from("user_achievements").select("achievement_key, unlocked_at").eq("user_id", userId).order("unlocked_at"),
      // daily_completions may not exist if migration wasn't applied — treat error as null
      supabase.from("daily_completions").select("id, xp_awarded, created_at").eq("user_id", userId).eq("completed_date", today).maybeSingle().then(r => r).catch(() => ({ data: null })),
    ]);

    const dayAlreadyCompleted = !!(todayCompletion as any)?.data;
    let tasks = tasksRes.data ?? [];

    console.log("[daily_mission] existing_tasks_count=", tasks.length, "day_already_completed=", dayAlreadyCompleted);

    // ── Case 1: Day is already marked complete in daily_completions ──────────
    // Use this as the source of truth. Reconcile tasks to all show completed.
    if (dayAlreadyCompleted) {
      if (tasks.length === 0) {
        // No tasks in DB (user completed via local fallback) — create fallback rows
        // already marked as complete so history shows something meaningful.
        const completedAt = (todayCompletion as any).data?.created_at ?? new Date().toISOString();
        const fallbackRows = FALLBACK_TASKS.map((t) => ({
          user_id: userId,
          title: t.title,
          description: t.description,
          category: t.category,
          completed: true,
          completed_at: completedAt,
        }));
        const { data: inserted } = await supabase
          .from("daily_tasks")
          .insert(fallbackRows)
          .select("*");
        tasks = inserted ?? [];
        console.log("[daily_mission] backfilled completed fallback tasks count=", tasks.length);
      } else {
        // Tasks exist but some may be uncompleted — mark them all done
        const incomplete = tasks.filter((t: any) => !t.completed);
        if (incomplete.length > 0) {
          const completedAt = (todayCompletion as any).data?.created_at ?? new Date().toISOString();
          await supabase
            .from("daily_tasks")
            .update({ completed: true, completed_at: completedAt })
            .eq("user_id", userId)
            .eq("task_date", today)
            .eq("completed", false);
          // Re-fetch after update
          const { data: refreshed } = await supabase
            .from("daily_tasks")
            .select("*")
            .eq("user_id", userId)
            .eq("task_date", today)
            .order("created_at");
          tasks = refreshed ?? tasks.map((t: any) => ({ ...t, completed: true, completed_at: completedAt }));
          console.log("[daily_mission] reconciled incomplete tasks to completed, count=", tasks.length);
        }
      }
    }

    // ── Case 2: Day not complete yet — ensure tasks exist ────────────────────
    if (!dayAlreadyCompleted && tasks.length === 0) {
      console.log("[daily_mission] no tasks — inserting fallback tasks");
      const fallbackRows = FALLBACK_TASKS.map((t) => ({
        user_id: userId,
        title: t.title,
        description: t.description,
        category: t.category,
      }));
      const { data: inserted, error: insertErr } = await supabase
        .from("daily_tasks")
        .insert(fallbackRows)
        .select("*");

      if (insertErr) {
        console.error("[daily_mission] fallback insert error:", insertErr.message);
        const { data: retry } = await supabase
          .from("daily_tasks").select("*").eq("user_id", userId).eq("task_date", today).order("created_at");
        tasks = retry ?? [];
      } else {
        tasks = inserted ?? [];
        console.log("[daily_mission] fallback tasks inserted count=", tasks.length);
      }
    }

    console.log("[daily_mission] returning_tasks_count=", tasks.length, "day_completed=", dayAlreadyCompleted);

    return {
      profile: profile.data,
      onboarding: onb.data,
      tasks,
      todayCompleted: dayAlreadyCompleted,
      todayXpAwarded: (todayCompletion as any)?.data?.xp_awarded ?? 0,
      progress: progress.data,
      todayMood: todayMood.data,
      journal: journal.data ?? [],
      relapses: relapses.data ?? [],
      subscription: subscription.data,
      isAdmin: !!roleRes.data,
      achievements: achievements.data ?? [],
    };
  });

export const getDailyCompletions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const { data } = await supabase
      .from("daily_completions")
      .select("id, completed_date, xp_awarded, created_at")
      .eq("user_id", userId)
      .gte("completed_date", since)
      .order("completed_date", { ascending: false });
    return { completions: data ?? [] };
  });

export const submitMood = createServerFn({ method: "POST" })  .middleware([requireSupabaseAuth])
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

/* ============================================================
   REENVIO MANUAL DE CONVITE (admin / suporte)
   Reusable quando o e-mail automático do webhook não chegou.
   ============================================================ */
export const resendInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ email: z.string().email() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { userId: requesterId } = context;

    // Only admins can trigger this
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: requesterId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Acesso negado.");

    const email = data.email.toLowerCase().trim();
    console.log("[resendInvite] requested by=", requesterId, "for=", email);

    const siteUrl = (process.env.SITE_URL ?? "https://www.lytra.shop").replace(/\/+$/, "");
    const redirectTo = `${siteUrl}/criar-senha`;

    // Find or create the user
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === email);

    let accessLink: string | null = null;

    if (existingUser) {
      console.log("[resendInvite] existing user id=", existingUser.id);
      // Generate recovery link → /criar-senha (set new password)
      const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo },
      });
      if (error) throw new Error(`Erro ao gerar link: ${error.message}`);
      accessLink = gen?.properties?.action_link ?? null;
    } else {
      console.log("[resendInvite] new user — inviting");
      const { data: gen, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo, data: { source: "kiwify" } },
      });
      if (error) throw new Error(`Erro ao criar convite: ${error.message}`);
      accessLink = gen?.properties?.action_link ?? null;
    }

    if (!accessLink) throw new Error("Não foi possível gerar link de acesso.");

    const { sendAccessEmail } = await import("@/lib/email.server");
    const result = await sendAccessEmail({ to: email, fullName: null, accessUrl: accessLink });
    if (!result.ok) throw new Error(`Falha ao enviar e-mail: ${result.error}`);

    console.log("[resendInvite] email sent ok id=", result.id, "to=", email);
    return { ok: true, email, resend_id: result.id };
  });
