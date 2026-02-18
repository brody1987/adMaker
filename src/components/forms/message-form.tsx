"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/image-uploader";
import { CopyInput } from "@/components/copy-input";
import { MESSAGE_SPECS, COPY_RULES } from "@/lib/specs";
import type { MessageSubtype, GenerateResponse, TextOverlayData } from "@/types/ad";

interface MessageFormProps {
  onResult: (result: GenerateResponse, textOverlay: TextOverlayData) => void;
}

const SUBTYPES: { value: MessageSubtype; label: string }[] = [
  { value: "wide-image", label: "와이드이미지" },
  { value: "wide-list-first", label: "와이드리스트 (첫번째)" },
  { value: "wide-list-rest", label: "와이드리스트 (나머지)" },
  { value: "carousel", label: "캐러셀" },
  { value: "basic-text", label: "기본텍스트" },
];

const copyRules = COPY_RULES.message;

export function MessageForm({ onResult }: MessageFormProps) {
  const [subtype, setSubtype] = useState<MessageSubtype>("wide-image");
  const [sizeIndex, setSizeIndex] = useState(0);
  const [productImage, setProductImage] = useState<string>("");
  const [mainCopy, setMainCopy] = useState("");
  const [subCopy, setSubCopy] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spec = MESSAGE_SPECS[subtype];
  const hasMultipleSizes = spec.sizes.length > 1;
  const selectedSize = spec.sizes[sizeIndex] ?? spec.sizes[0];

  const handleSubtypeChange = (value: string) => {
    setSubtype(value as MessageSubtype);
    setSizeIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("이미지를 업로드해 주세요.");
      return;
    }
    if (!mainCopy.trim()) {
      setError("메인 카피를 입력해 주세요.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "message",
          subtype,
          sizeIndex: hasMultipleSizes ? sizeIndex : undefined,
          productImage,
          mainCopy,
          subCopy: subCopy || undefined,
          additionalInfo: buttonName ? `버튼명: ${buttonName}` : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `요청 실패 (${res.status})`);
      }

      const result: GenerateResponse = await res.json();
      onResult(result, {
        mainCopy,
        subCopy: subCopy || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 광고 유형 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">광고 유형</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>서브타입</Label>
            <Select value={subtype} onValueChange={handleSubtypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBTYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasMultipleSizes && (
            <div className="space-y-1.5">
              <Label>이미지 크기</Label>
              <Select
                value={String(sizeIndex)}
                onValueChange={(v) => setSizeIndex(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {spec.sizes.map((size, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {size.width} × {size.height}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 규격 정보 */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">
              {selectedSize.width} × {selectedSize.height}px
            </Badge>
            {spec.format.map((f) => (
              <Badge key={f} variant="outline">
                {f.toUpperCase()}
              </Badge>
            ))}
            <Badge variant="outline">최대 {spec.maxSizeKB / 1024}MB</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 이미지 업로드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">제품 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            onImageSelect={setProductImage}
            maxSizeMB={spec.maxSizeKB / 1024}
          />
        </CardContent>
      </Card>

      {/* 카피 입력 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">광고 문구</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CopyInput
            label="메인 카피"
            value={mainCopy}
            onChange={setMainCopy}
            maxLength={copyRules.mainCopy.maxLength}
            forbiddenChars={[...copyRules.mainCopy.forbiddenChars]}
            placeholder="메인 카피를 입력하세요"
          />
          <CopyInput
            label="서브 카피 (선택)"
            value={subCopy}
            onChange={setSubCopy}
            maxLength={copyRules.subCopy.maxLength}
            forbiddenChars={[...copyRules.subCopy.forbiddenChars]}
            placeholder="서브 카피를 입력하세요"
          />
          <div className="space-y-1.5">
            <Label>버튼명 (선택)</Label>
            <Input
              value={buttonName}
              onChange={(e) => setButtonName(e.target.value)}
              placeholder="예: 자세히 보기, 지금 구매"
              maxLength={20}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "생성 중..." : "생성하기"}
      </Button>
    </form>
  );
}
