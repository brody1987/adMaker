"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisplayForm } from "@/components/forms/display-form";
import { BannerPreview } from "@/components/banner-preview";
import { BannerDownload } from "@/components/banner-download";
import type { GenerateResponse } from "@/types/ad";

export default function DisplayPage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 홈으로
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            디스플레이 배너 제작
          </h1>
          <p className="mt-2 text-muted-foreground">
            카카오 서비스 내 다양한 지면에 노출되는 이미지 광고를 AI로 생성합니다.
            2:1, 1:1, 9:16, 4:5 비율을 지원합니다.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>배너 정보 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <DisplayForm onResult={setResult} />
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>생성 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <BannerPreview
                  imageBase64={result.imageBase64}
                  mimeType={result.mimeType}
                  width={result.width}
                  height={result.height}
                  fileSizeKB={result.fileSizeKB}
                  specCompliant={result.specCompliant}
                  warnings={result.warnings}
                />
              </CardContent>
            </Card>

            <BannerDownload
              imageBase64={result.imageBase64}
              mimeType={result.mimeType}
              filename={`display-banner.${result.mimeType.split("/")[1]}`}
            />
          </div>
        )}
      </main>
    </div>
  );
}
