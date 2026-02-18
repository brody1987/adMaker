"use client";

import { useState } from "react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerDownloadProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
  filename: string;
  format?: "png" | "jpg";
  className?: string;
}

export function BannerDownload({
  canvasRef,
  width,
  height,
  filename,
  format = "png",
  className,
}: BannerDownloadProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownload = async () => {
    const element = canvasRef.current;
    if (!element) return;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(element, {
        width,
        height,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        onclone: (_doc, clonedEl) => {
          // Reset transform scale so html2canvas captures at full resolution
          clonedEl.style.transform = "none";
        },
      });

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const quality = format === "jpg" ? 0.92 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        mimeType,
        quality
      );
    } catch (err) {
      console.error("Banner capture failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className={cn("w-full", className)}
      size="lg"
      disabled={isCapturing}
    >
      {isCapturing ? "이미지 합성 중..." : "다운로드"}
    </Button>
  );
}
