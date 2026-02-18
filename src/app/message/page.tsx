"use client";

import { useState } from "react";
import { MessageForm } from "@/components/forms/message-form";
import { BannerPreview } from "@/components/banner-preview";
import { BannerDownload } from "@/components/banner-download";
import type { GenerateResponse } from "@/types/ad";

export default function MessagePage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);

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
          <MessageForm onResult={setResult} />
        </div>

        <div className="space-y-4">
          {result ? (
            <>
              <h2 className="text-lg font-semibold">미리보기</h2>
              <BannerPreview
                imageBase64={result.imageBase64}
                mimeType={result.mimeType}
                width={result.width}
                height={result.height}
                fileSizeKB={result.fileSizeKB}
                specCompliant={result.specCompliant}
                warnings={result.warnings}
              />
              <BannerDownload
                imageBase64={result.imageBase64}
                mimeType={result.mimeType}
                filename={`message-banner.${result.mimeType.split("/")[1] ?? "png"}`}
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
