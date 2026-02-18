import sharp from "sharp";
import type {
  AdType,
  BizboardSubtype,
  DisplayRatio,
  MessageSubtype,
} from "@/types/ad";
import { BIZBOARD_SPECS, DISPLAY_SPECS, MESSAGE_SPECS } from "@/lib/specs";

export interface ProcessImageOptions {
  width: number;
  height: number;
  format: "png" | "jpg";
  maxSizeKB: number;
  transparentBg?: boolean;
}

export interface ProcessImageResult {
  buffer: Buffer;
  mimeType: string;
  fileSizeKB: number;
}

export async function processImage(
  imageBuffer: Buffer,
  options: ProcessImageOptions
): Promise<ProcessImageResult> {
  const { width, height, format, maxSizeKB, transparentBg } = options;

  let pipeline = sharp(imageBuffer).resize(width, height, {
    fit: "cover",
    position: "center",
  });

  let outputBuffer: Buffer;

  if (format === "png" || transparentBg) {
    outputBuffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();

    // Iteratively reduce PNG compression if needed — PNG quality can't be reduced
    // the same way as JPEG, so we just return as-is for PNG
    const fileSizeKB = outputBuffer.length / 1024;
    if (fileSizeKB > maxSizeKB) {
      // Try reducing via resize slightly — as a fallback
      const scale = Math.sqrt(maxSizeKB / fileSizeKB);
      const scaledWidth = Math.floor(width * scale);
      const scaledHeight = Math.floor(height * scale);
      outputBuffer = await sharp(imageBuffer)
        .resize(scaledWidth, scaledHeight, { fit: "cover", position: "center" })
        .resize(width, height, { fit: "cover", position: "center" })
        .png({ compressionLevel: 9 })
        .toBuffer();
    }

    return {
      buffer: outputBuffer,
      mimeType: "image/png",
      fileSizeKB: outputBuffer.length / 1024,
    };
  } else {
    // JPEG: iteratively reduce quality to meet maxSizeKB
    let quality = 90;
    outputBuffer = await pipeline.jpeg({ quality }).toBuffer();

    while (outputBuffer.length / 1024 > maxSizeKB && quality > 10) {
      quality -= 10;
      outputBuffer = await sharp(imageBuffer)
        .resize(width, height, { fit: "cover", position: "center" })
        .jpeg({ quality })
        .toBuffer();
    }

    return {
      buffer: outputBuffer,
      mimeType: "image/jpeg",
      fileSizeKB: outputBuffer.length / 1024,
    };
  }
}

export interface SpecResult {
  width: number;
  height: number;
  format: "png" | "jpg";
  maxSizeKB: number;
  transparentBg?: boolean;
}

export function getSpecForAdType(
  adType: AdType,
  subtype: string,
  sizeIndex = 0
): SpecResult {
  if (adType === "bizboard") {
    const spec = BIZBOARD_SPECS[subtype as BizboardSubtype];
    const format = spec.format[0];
    return {
      width: spec.bannerSize.width,
      height: spec.bannerSize.height,
      format,
      maxSizeKB: spec.maxBannerSizeKB,
      transparentBg: spec.transparentBg,
    };
  } else if (adType === "display") {
    const spec = DISPLAY_SPECS[subtype as DisplayRatio];
    const format = spec.format[0];
    return {
      width: spec.size.width,
      height: spec.size.height,
      format,
      maxSizeKB: spec.maxSizeKB,
    };
  } else {
    const spec = MESSAGE_SPECS[subtype as MessageSubtype];
    const size = spec.sizes[sizeIndex] ?? spec.sizes[0];
    const format = spec.format[0];
    return {
      width: size.width,
      height: size.height,
      format,
      maxSizeKB: spec.maxSizeKB,
    };
  }
}
