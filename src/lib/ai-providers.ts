// src/lib/ai-providers.ts

import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { Anthropic } from "@anthropic-ai/sdk";

// const openai = process.env.OPENAI_API_KEY
//   ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//   : null;

const openai = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "WriteFlow AI",
      },
    })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export type RewriteOptions = {
  text: string;
  tone:
    | "professional"
    | "formal"
    | "friendly"
    | "academic"
    | "creative"
    | "simple";
  length: "shorter" | "same" | "longer";
  creativity: number;
  modelProvider: "openai" | "anthropic" | "gemini";
};

export async function executeAiRewrite(
  options: RewriteOptions
): Promise<string> {
  const systemPrompt = `You are an elite, professional AI writing editor.

Tone: ${options.tone}
Length: ${options.length}
Preserve the original meaning while making the writing natural, fluent, human-like, and grammatically correct.`;

  switch (options.modelProvider) {
    // ======================================================
    // GEMINI
    // ======================================================
    case "gemini": {
      if (!ai) {
        throw new Error("Gemini API key not configured.");
      }

      try {
        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          contents: `${systemPrompt}\n\n${options.text}`,
          config: {
            temperature: options.creativity,
          },
        });

        if (!geminiResponse.text) {
          throw new Error("Gemini returned an empty response.");
        }

        return geminiResponse.text;
      } catch (err: any) {
        console.error("[GEMINI_ERROR]", err);

        if (err.status === 401) {
          throw new Error("Invalid Gemini API key.");
        }

        if (err.status === 429) {
          throw new Error(
            "Gemini quota exceeded. Please check your Google AI Studio billing."
          );
        }

        throw new Error(err.message || "Gemini request failed.");
      }
    }

    // ======================================================
    // ANTHROPIC
    // ======================================================
    case "anthropic": {
      if (!anthropic) {
        throw new Error("Anthropic API key not configured.");
      }

      try {
        const claude = await anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 4000,
          temperature: options.creativity,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: options.text,
            },
          ],
        });

        if (
          claude.content.length === 0 ||
          claude.content[0].type !== "text"
        ) {
          throw new Error("Claude returned an empty response.");
        }

        return claude.content[0].text;
      } catch (err: any) {
        console.error("[ANTHROPIC_ERROR]", err);

        if (err.status === 401) {
          throw new Error("Invalid Anthropic API key.");
        }

        if (err.status === 429) {
          throw new Error("Anthropic quota exceeded.");
        }

        throw new Error(err.message || "Claude request failed.");
      }
    }

    // ======================================================
    // OPENAI
    // ======================================================
    case "openai":
    default: {
      if (!openai) {
        throw new Error("OpenAI API key not configured.");
      }

      try {
        const response = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b",
          temperature: options.creativity,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: options.text,
            },
          ],
        });

        const output = response.choices?.[0]?.message?.content;

        if (!output) {
          throw new Error("OpenAI returned an empty response.");
        }

        return output;
      } catch (err: any) {
        console.error("[OPENAI_ERROR]", err);

        if (err.status === 401) {
          throw new Error("Invalid OpenAI API key.");
        }

        if (err.status ===429) {
          throw new Error(
            "OpenAI quota exceeded. Add billing or switch to Gemini."
          );
        }

        throw new Error(err.message || "OpenAI request failed.");
      }
    }
  }
}