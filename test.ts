import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function run() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "Say hello in one sentence.",
    });

    console.log("Response:");
    console.log(res.text);
  } catch (err) {
    console.error(err);
  }
}

run();