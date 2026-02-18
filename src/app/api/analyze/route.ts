import { NextRequest, NextResponse } from "next/server";
import { genAI, ANALYZE_MODEL } from "@/lib/gemini";
import { buildAnalyzePrompt } from "@/lib/prompts";
import type { AnalyzeRequest, AnalyzeResponse } from "@/types/ad";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { productImage, adType, subtype } = body;

    if (!productImage || !adType || !subtype) {
      return NextResponse.json(
        { error: "productImage, adType, subtype are required" },
        { status: 400 }
      );
    }

    // Extract raw base64 from data URL if needed
    let base64Data = productImage;
    let mimeType = "image/jpeg";
    if (productImage.startsWith("data:")) {
      const [header, data] = productImage.split(",");
      base64Data = data;
      const match = header.match(/data:([^;]+);base64/);
      if (match) mimeType = match[1];
    }

    const prompt = buildAnalyzePrompt(adType, subtype);

    const result = await genAI.models.generateContent({
      model: ANALYZE_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse JSON response (strip markdown code block if present)
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    const analysis: AnalyzeResponse = JSON.parse(cleaned);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze error:", error);
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
