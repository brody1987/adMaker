export type AdType = "bizboard" | "display" | "message";

// ── 비즈보드 ──
export type BizboardSubtype =
  | "object"
  | "thumbnail-box"
  | "thumbnail-blur"
  | "thumbnail-multi"
  | "masking-semicircle";

export interface BizboardSpec {
  label: string;
  bannerSize: { width: number; height: number };
  objectSize: { width: number; height: number };
  objectCount?: number;
  format: ("png" | "jpg")[];
  transparentBg?: boolean;
  maxBannerSizeKB: number;
  maxObjectSizeKB: number;
}

// ── 디스플레이 ──
export type DisplayRatio = "2:1" | "1:1" | "9:16" | "4:5";

export interface DisplaySpec {
  label: string;
  ratio: DisplayRatio;
  size: { width: number; height: number };
  format: ("png" | "jpg")[];
  maxSizeKB: number;
}

// ── 메시지 ──
export type MessageSubtype =
  | "wide-image"
  | "wide-list-first"
  | "wide-list-rest"
  | "carousel"
  | "basic-text";

export interface MessageSpec {
  label: string;
  sizes: { width: number; height: number }[];
  format: ("png" | "jpg")[];
  maxSizeKB: number;
}

// ── 공통 ──
export interface GenerateRequest {
  adType: AdType;
  subtype: string;
  sizeIndex?: number;
  productImage: string; // base64
  mainCopy: string;
  subCopy?: string;
  badge?: string;
  brandName?: string;
  additionalInfo?: string;
}

export interface GenerateResponse {
  imageBase64: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
  specCompliant: boolean;
  warnings: string[];
}

export interface AnalyzeRequest {
  productImage: string; // base64
  adType: AdType;
  subtype: string;
}

export interface AnalyzeResponse {
  productDescription: string;
  dominantColors: string[];
  mood: string;
  suggestedLayout: string;
  imagePrompt: string;
}
