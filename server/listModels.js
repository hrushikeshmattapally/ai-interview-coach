import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  try {
    const { models } = await genAI.listModels();
    console.log("✅ Available models:");
    models.forEach((m) => console.log("-", m.name));
  } catch (error) {
    console.error("❌ Error listing models:", error);
  }
}

listAvailableModels();
