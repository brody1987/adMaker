import type { AdType } from "@/types/ad";
import {
  BIZBOARD_SPECS,
  DISPLAY_SPECS,
  MESSAGE_SPECS,
} from "@/lib/specs";
import type { BizboardSubtype, DisplayRatio, MessageSubtype } from "@/types/ad";

// ── 제품 이미지 분석 프롬프트 ──
export function buildAnalyzePrompt(adType: AdType, subtype: string): string {
  return `당신은 카카오모먼트 광고 배너를 만드는 전문 디자이너입니다.

첨부된 제품 이미지를 분석하고 다음 정보를 JSON으로 반환하세요:

{
  "productDescription": "제품에 대한 간결한 설명 (한국어)",
  "dominantColors": ["주요 색상 HEX 코드 3개"],
  "mood": "이미지 분위기 (예: 깔끔한, 고급스러운, 캐주얼한, 따뜻한)",
  "suggestedLayout": "광고 배너에서 제품을 배치하는 최적 구도 설명",
  "imagePrompt": "이 제품을 활용한 ${adType} 광고 배너를 생성하기 위한 상세한 영문 프롬프트"
}

광고 유형: ${adType}
하위 유형: ${subtype}

중요 사항:
- imagePrompt는 반드시 영문으로 작성
- 제품의 핵심 특성을 정확하게 반영
- 광고 규격에 적합한 레이아웃 제안
- JSON만 반환, 마크다운 코드블록 없이`;
}

// ── 배너 이미지 생성 프롬프트 ──
export function buildGeneratePrompt(params: {
  adType: AdType;
  subtype: string;
  sizeIndex?: number;
  mainCopy: string;
  subCopy?: string;
  badge?: string;
  brandName?: string;
  analysisResult: string;
}): string {
  const { adType, subtype, sizeIndex, mainCopy, subCopy, badge, brandName, analysisResult } = params;

  let specInfo = "";
  let width = 0;
  let height = 0;

  if (adType === "bizboard") {
    const spec = BIZBOARD_SPECS[subtype as BizboardSubtype];
    width = spec.bannerSize.width;
    height = spec.bannerSize.height;
    specInfo = `배너 사이즈: ${width}x${height}px, 오브젝트 사이즈: ${spec.objectSize.width}x${spec.objectSize.height}px`;
    if (spec.transparentBg) specInfo += ", 투명 배경 필요";
  } else if (adType === "display") {
    const spec = DISPLAY_SPECS[subtype as DisplayRatio];
    width = spec.size.width;
    height = spec.size.height;
    specInfo = `사이즈: ${width}x${height}px (비율 ${spec.ratio})`;
  } else if (adType === "message") {
    const spec = MESSAGE_SPECS[subtype as MessageSubtype];
    const idx = sizeIndex ?? 0;
    const size = spec.sizes[idx];
    width = size.width;
    height = size.height;
    specInfo = `사이즈: ${width}x${height}px`;
  }

  return `Create a professional Korean advertising banner image with these specifications:

Size: ${width}x${height} pixels
Type: ${adType} (${subtype})
Spec: ${specInfo}

Main Copy (Korean text to include): "${mainCopy}"
${subCopy ? `Sub Copy: "${subCopy}"` : ""}
${badge ? `Badge: "${badge}"` : ""}
${brandName ? `Brand: "${brandName}"` : ""}

Product Analysis:
${analysisResult}

Design Requirements:
- Clean, professional Korean advertising style
- Product should be prominently featured
- Text should be clearly readable with proper hierarchy
- Use colors that complement the product
- Follow Kakao Moment ad guidelines
- ${adType === "bizboard" ? "Horizontal banner layout, product on the right side" : ""}
- ${adType === "display" ? "Eye-catching display ad with balanced composition" : ""}
- ${adType === "message" ? "Message-style ad optimized for mobile viewing" : ""}
- Do NOT include any watermarks or AI attribution
- Korean text must be accurate and properly rendered`;
}
