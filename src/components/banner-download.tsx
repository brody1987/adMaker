"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerDownloadProps {
  imageBase64: string;
  mimeType: string;
  filename: string;
  className?: string;
}

export function BannerDownload({
  imageBase64,
  mimeType,
  filename,
  className,
}: BannerDownloadProps) {
  const handleDownload = () => {
    const src = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:${mimeType};base64,${imageBase64}`;

    const link = document.createElement("a");
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      className={cn("w-full", className)}
      size="lg"
    >
      다운로드
    </Button>
  );
}
