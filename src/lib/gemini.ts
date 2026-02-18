import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.warn("GOOGLE_API_KEY is not set. Gemini API calls will fail.");
}

export const genAI = new GoogleGenAI({ apiKey: apiKey ?? "" });

// 분석용 (텍스트 전용)
export const ANALYZE_MODEL = "gemini-3-pro-preview";

// 이미지 생성용
export const IMAGE_MODEL = "gemini-3-pro-image-preview";
