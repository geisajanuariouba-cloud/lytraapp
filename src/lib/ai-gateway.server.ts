import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Provider de IA da Lytra — Google Gemini via endpoint compatível com OpenAI.
 *
 * Usa a API oficial do Gemini no modo OpenAI-compatible
 * (https://ai.google.dev/gemini-api/docs/openai), o que permite reaproveitar
 * o mesmo `@ai-sdk/openai-compatible` já presente no projeto, sem adicionar
 * novas dependências nem acoplar nada à Lovable.
 *
 * `apiKey` vai como `Authorization: Bearer <GEMINI_API_KEY>`.
 */
export const createGeminiProvider = (apiKey: string) =>
  createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey,
  });
