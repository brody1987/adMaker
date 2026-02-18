import { NextRequest, NextResponse } from "next/server";
import { genAI, ANALYZE_MODEL, IMAGE_MODEL } from "@/lib/gemini";
import { buildAnalyzePrompt, buildGeneratePrompt } from "@/lib/prompts";
import { processImage, getSpecForAdType } from "@/lib/image-processing";
import type {
  GenerateRequest,
  GenerateResponse,
  AnalyzeResponse,
} from "@/types/ad";

async function analyzeProduct(
  base64Data: string,
  mimeType: string,
  adType: GenerateRequest["adType"],
  subtype: string
): Promise<AnalyzeResponse> {
  const prompt = buildAnalyzePrompt(adType, subtype);

  const result = await genAI.models.generateContent({
    model: ANALYZE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt },
        ],
      },
    ],
  });

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as AnalyzeResponse;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const {
      adType,
      subtype,
      sizeIndex,
      productImage,
      mainCopy,
      subCopy,
      badge,
      brandName,
      additionalInfo,
    } = body;

    if (!adType || !subtype || !productImage || !mainCopy) {
      return NextResponse.json(
        { error: "adType, subtype, productImage, mainCopy are required" },
        { status: 400 }
      );
    }

    // Extract raw base64 and mimeType from data URL
    let base64Data = productImage;
    let imageMimeType = "image/jpeg";
    if (productImage.startsWith("data:")) {
      const [header, data] = productImage.split(",");
      base64Data = data;
      const match = header.match(/data:([^;]+);base64/);
      if (match) imageMimeType = match[1];
    }

    // Step 1: Analyze product image
    const analysis = await analyzeProduct(
      base64Data,
      imageMimeType,
      adType,
      subtype
    );

    const analysisText = JSON.stringify(analysis, null, 2);

    // Step 2: Generate banner image
    const generatePrompt = buildGeneratePrompt({
      adType,
      subtype,
      sizeIndex,
      mainCopy,
      subCopy,
      badge,
      brandName,
      analysisResult: analysisText,
    });

    const fullPrompt = additionalInfo
      ? `${generatePrompt}\n\nAdditional requirements: ${additionalInfo}`
      : generatePrompt;

    const generateResult = await genAI.models.generateContent({
      model: IMAGE_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: imageMimeType, data: base64Data } },
            { text: fullPrompt },
          ],
        },
      ],
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    // Extract generated image from response
    const parts = generateResult.candidates?.[0]?.content?.parts ?? [];
    let generatedImageBase64: string | null = null;
    let generatedMimeType = "image/png";

    for (const part of parts) {
      if (part.inlineData?.data) {
        generatedImageBase64 = part.inlineData.data;
        generatedMimeType = part.inlineData.mimeType ?? "image/png";
        break;
      }
    }

    if (!generatedImageBase64) {
      return NextResponse.json(
        { error: "Image generation failed: no image in response" },
        { status: 500 }
      );
    }

    // Step 3: Post-process with Sharp
    const spec = getSpecForAdType(adType, subtype, sizeIndex ?? 0);
    const imageBuffer = Buffer.from(generatedImageBase64, "base64");

    const { buffer, mimeType: outputMimeType, fileSizeKB } = await processImage(
      imageBuffer,
      {
        width: spec.width,
        height: spec.height,
        format: spec.format,
        maxSizeKB: spec.maxSizeKB,
        transparentBg: spec.transparentBg,
      }
    );

    const outputBase64 = buffer.toString("base64");
    const outputDataUrl = `data:${outputMimeType};base64,${outputBase64}`;

    // Build compliance check
    const warnings: string[] = [];
    if (fileSizeKB > spec.maxSizeKB) {
      warnings.push(
        `File size ${fileSizeKB.toFixed(1)}KB exceeds limit of ${spec.maxSizeKB}KB`
      );
    }

    const response: GenerateResponse = {
      backgroundImage: outputDataUrl,
      mimeType: outputMimeType,
      width: spec.width,
      height: spec.height,
      fileSizeKB: Math.round(fileSizeKB * 10) / 10,
      specCompliant: warnings.length === 0,
      warnings,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
