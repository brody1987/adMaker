"use client";

import { useRef, useState } from "react";
import { MessageForm } from "@/components/forms/message-form";
import { BannerPreview } from "@/components/banner-preview";
import { BannerDownload } from "@/components/banner-download";
import type { GenerateResponse, TextOverlayData } from "@/types/ad";

export default function MessagePage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [textOverlay, setTextOverlay] = useState<TextOverlayData | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleResult = (data: GenerateResponse, text: TextOverlayData) => {
    setResult(data);
    setTextOverlay(text);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">메시지 배너 제작</h1>
        <p className="mt-2 text-muted-foreground">
          카카오톡 비즈메시지에 사용되는 배너 이미지를 AI로 자동 생성합니다. 와이드이미지,
          와이드리스트, 캐러셀, 기본텍스트 형식을 지원합니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <MessageForm onResult={handleResult} />
        </div>

        <div className="space-y-4">
          {result && textOverlay ? (
            <>
              <h2 className="text-lg font-semibold">미리보기</h2>
              <BannerPreview
                backgroundImage={result.backgroundImage}
                mimeType={result.mimeType}
                width={result.width}
                height={result.height}
                fileSizeKB={result.fileSizeKB}
                specCompliant={result.specCompliant}
                warnings={result.warnings}
                textOverlay={textOverlay}
                adType="message"
                subtype="wide-image"
                canvasRef={canvasRef}
              />
              <BannerDownload
                canvasRef={canvasRef}
                width={result.width}
                height={result.height}
                filename={`message-banner.${result.mimeType.split("/")[1] ?? "png"}`}
                format={result.mimeType.includes("jpeg") || result.mimeType.includes("jpg") ? "jpg" : "png"}
              />
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-sm text-muted-foreground">
              생성하기 버튼을 누르면 미리보기가 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
