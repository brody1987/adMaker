import type {
  BizboardSubtype,
  BizboardSpec,
  DisplayRatio,
  DisplaySpec,
  MessageSubtype,
  MessageSpec,
} from "@/types/ad";

// ── 비즈보드 규격 ──
export const BIZBOARD_SPECS: Record<BizboardSubtype, BizboardSpec> = {
  object: {
    label: "오브젝트형",
    bannerSize: { width: 1029, height: 258 },
    objectSize: { width: 315, height: 258 },
    format: ["png"],
    transparentBg: true,
    maxBannerSizeKB: 300,
    maxObjectSizeKB: 150,
  },
  "thumbnail-box": {
    label: "썸네일 박스형",
    bannerSize: { width: 1029, height: 258 },
    objectSize: { width: 315, height: 186 },
    format: ["jpg", "png"],
    maxBannerSizeKB: 300,
    maxObjectSizeKB: 10240,
  },
  "thumbnail-blur": {
    label: "썸네일 블러형",
    bannerSize: { width: 1029, height: 258 },
    objectSize: { width: 360, height: 247 },
    format: ["jpg", "png"],
    maxBannerSizeKB: 300,
    maxObjectSizeKB: 300,
  },
  "thumbnail-multi": {
    label: "썸네일 멀티형",
    bannerSize: { width: 1029, height: 258 },
    objectSize: { width: 172, height: 172 },
    objectCount: 3,
    format: ["jpg", "png"],
    maxBannerSizeKB: 300,
    maxObjectSizeKB: 300,
  },
  "masking-semicircle": {
    label: "마스킹 반원형",
    bannerSize: { width: 1029, height: 258 },
    objectSize: { width: 360, height: 213 },
    format: ["jpg", "png"],
    maxBannerSizeKB: 300,
    maxObjectSizeKB: 300,
  },
};

// ── 디스플레이 규격 ──
export const DISPLAY_SPECS: Record<DisplayRatio, DisplaySpec> = {
  "2:1": {
    label: "2:1 (가로형)",
    ratio: "2:1",
    size: { width: 1200, height: 600 },
    format: ["jpg", "png"],
    maxSizeKB: 500,
  },
  "1:1": {
    label: "1:1 (정사각형)",
    ratio: "1:1",
    size: { width: 500, height: 500 },
    format: ["jpg", "png"],
    maxSizeKB: 500,
  },
  "9:16": {
    label: "9:16 (세로형)",
    ratio: "9:16",
    size: { width: 720, height: 1280 },
    format: ["jpg", "png"],
    maxSizeKB: 500,
  },
  "4:5": {
    label: "4:5 (세로형)",
    ratio: "4:5",
    size: { width: 800, height: 1000 },
    format: ["jpg", "png"],
    maxSizeKB: 500,
  },
};

// ── 메시지 규격 ──
export const MESSAGE_SPECS: Record<MessageSubtype, MessageSpec> = {
  "wide-image": {
    label: "와이드이미지",
    sizes: [{ width: 800, height: 600 }],
    format: ["jpg", "png"],
    maxSizeKB: 10240,
  },
  "wide-list-first": {
    label: "와이드리스트 (첫번째)",
    sizes: [{ width: 800, height: 400 }],
    format: ["jpg", "png"],
    maxSizeKB: 10240,
  },
  "wide-list-rest": {
    label: "와이드리스트 (나머지)",
    sizes: [{ width: 800, height: 800 }],
    format: ["jpg", "png"],
    maxSizeKB: 10240,
  },
  carousel: {
    label: "캐러셀",
    sizes: [
      { width: 800, height: 400 },
      { width: 800, height: 600 },
    ],
    format: ["jpg", "png"],
    maxSizeKB: 10240,
  },
  "basic-text": {
    label: "기본텍스트",
    sizes: [
      { width: 800, height: 400 },
      { width: 800, height: 800 },
      { width: 800, height: 600 },
    ],
    format: ["jpg", "png"],
    maxSizeKB: 10240,
  },
};

// ── 카피 규칙 ──
export const COPY_RULES = {
  bizboard: {
    mainCopy: { maxLength: 25, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
    subCopy: { maxLength: 30, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
  },
  display: {
    mainCopy: { maxLength: 25, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
    subCopy: { maxLength: 30, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
  },
  message: {
    mainCopy: { maxLength: 25, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
    subCopy: { maxLength: 30, forbiddenChars: ["!", "@", "#", "★", "☆", "♥"] },
  },
} as const;
