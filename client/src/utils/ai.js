
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Store your key in .env

export const generateMessageWithAI = async (prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    // result is a GenerateContentResult
    const text = result.response.text(); // no iteration needed

    return text || "No response generated";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate text: ${error.message}`);
  }
};
