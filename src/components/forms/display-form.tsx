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
import { DISPLAY_SPECS, COPY_RULES } from "@/lib/specs";
import type { DisplayRatio, GenerateResponse, TextOverlayData } from "@/types/ad";

interface DisplayFormProps {
  onResult: (result: GenerateResponse, textOverlay: TextOverlayData) => void;
}

export function DisplayForm({ onResult }: DisplayFormProps) {
  const [ratio, setRatio] = useState<DisplayRatio>("2:1");
  const [productImage, setProductImage] = useState<string>("");
  const [mainCopy, setMainCopy] = useState("");
  const [subCopy, setSubCopy] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSpec = DISPLAY_SPECS[ratio];
  const copyRules = COPY_RULES.display;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("이미지를 업로드해주세요.");
      return;
    }
    if (!mainCopy.trim()) {
      setError("메인 카피를 입력해주세요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "display",
          subtype: ratio,
          productImage,
          mainCopy,
          subCopy: subCopy || undefined,
          brandName: brandName || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "생성에 실패했습니다.");
      }

      const result: GenerateResponse = await res.json();
      onResult(result, {
        mainCopy,
        subCopy: subCopy || undefined,
        brandName: brandName || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 비율 선택 */}
      <div className="space-y-2">
        <Label htmlFor="ratio-select">비율 선택</Label>
        <Select value={ratio} onValueChange={(v) => setRatio(v as DisplayRatio)}>
          <SelectTrigger id="ratio-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(DISPLAY_SPECS) as DisplayRatio[]).map((r) => (
              <SelectItem key={r} value={r}>
                {DISPLAY_SPECS[r].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 선택된 규격 정보 */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {selectedSpec.size.width} × {selectedSpec.size.height}px
            </Badge>
            <Badge variant="outline">
              {selectedSpec.format.map((f) => f.toUpperCase()).join(" / ")}
            </Badge>
            <Badge variant="outline">최대 {selectedSpec.maxSizeKB}KB</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 이미지 업로드 */}
      <div className="space-y-2">
        <Label>제품 이미지</Label>
        <ImageUploader onImageSelect={setProductImage} maxSizeMB={10} />
      </div>

      {/* 메인 카피 */}
      <CopyInput
        label="메인 카피"
        value={mainCopy}
        onChange={setMainCopy}
        maxLength={copyRules.mainCopy.maxLength}
        forbiddenChars={[...copyRules.mainCopy.forbiddenChars]}
        placeholder="메인 카피를 입력하세요"
      />

      {/* 서브 카피 */}
      <CopyInput
        label="서브 카피 (선택)"
        value={subCopy}
        onChange={setSubCopy}
        maxLength={copyRules.subCopy.maxLength}
        forbiddenChars={[...copyRules.subCopy.forbiddenChars]}
        placeholder="서브 카피를 입력하세요"
      />

      {/* 브랜드명 */}
      <div className="space-y-2">
        <Label htmlFor="brand-name">브랜드명 (선택)</Label>
        <Input
          id="brand-name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="브랜드명을 입력하세요"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "생성 중..." : "생성하기"}
      </Button>
    </form>
  );
}
