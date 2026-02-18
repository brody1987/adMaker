"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BizboardForm } from "@/components/forms/bizboard-form";
import { BannerPreview } from "@/components/banner-preview";
import { BannerDownload } from "@/components/banner-download";
import type { GenerateResponse } from "@/types/ad";

export default function BizboardPage() {
  const [result, setResult] = useState<GenerateResponse | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 홈으로
        </Link>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">비즈보드 배너 제작</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            카카오 비즈보드는 카카오톡 채팅 목록 상단에 노출되는 프리미엄 배너 광고입니다.
            유형에 맞는 이미지와 카피를 입력하여 배너를 생성하세요.
          </p>
        </div>

        {/* 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>광고 정보 입력</CardTitle>
            <CardDescription>유형을 선택하고 이미지와 카피를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <BizboardForm onResult={setResult} />
          </CardContent>
        </Card>

        {/* 결과 */}
        {result && (
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>생성 결과</CardTitle>
                <CardDescription>생성된 배너를 확인하고 다운로드하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  filename={`bizboard-banner.${result.mimeType.split("/")[1] ?? "png"}`}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
