"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/image-uploader";
import { CopyInput } from "@/components/copy-input";
import { BIZBOARD_SPECS, COPY_RULES } from "@/lib/specs";
import type { BizboardSubtype, GenerateResponse, TextOverlayData } from "@/types/ad";

interface BizboardFormProps {
  onResult: (result: GenerateResponse, textOverlay: TextOverlayData) => void;
}

const SUBTYPES: BizboardSubtype[] = [
  "object",
  "thumbnail-box",
  "thumbnail-blur",
  "thumbnail-multi",
  "masking-semicircle",
];

export function BizboardForm({ onResult }: BizboardFormProps) {
  const [subtype, setSubtype] = useState<BizboardSubtype>("object");
  const [productImage, setProductImage] = useState<string>("");
  const [mainCopy, setMainCopy] = useState("");
  const [subCopy, setSubCopy] = useState("");
  const [badge, setBadge] = useState("");
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spec = BIZBOARD_SPECS[subtype];
  const copyRules = COPY_RULES.bizboard;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("상품 이미지를 업로드해주세요.");
      return;
    }
    if (!mainCopy.trim()) {
      setError("메인 카피를 입력해주세요.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adType: "bizboard",
          subtype,
          productImage,
          mainCopy,
          subCopy: subCopy || undefined,
          badge: badge || undefined,
          brandName: brandName || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "생성에 실패했습니다.");
      }

      const data: GenerateResponse = await res.json();
      onResult(data, {
        mainCopy,
        subCopy: subCopy || undefined,
        badge: badge || undefined,
        brandName: brandName || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 서브타입 선택 */}
      <div className="space-y-1.5">
        <Label htmlFor="subtype">광고 유형</Label>
        <Select
          value={subtype}
          onValueChange={(v) => setSubtype(v as BizboardSubtype)}
        >
          <SelectTrigger id="subtype">
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            {SUBTYPES.map((key) => (
              <SelectItem key={key} value={key}>
                {BIZBOARD_SPECS[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 규격 정보 */}
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground text-sm">{spec.label} 규격</p>
        <p>배너 크기: {spec.bannerSize.width} × {spec.bannerSize.height}px</p>
        <p>
          오브젝트 크기: {spec.objectSize.width} × {spec.objectSize.height}px
          {spec.objectCount ? ` × ${spec.objectCount}개` : ""}
        </p>
        <p>포맷: {spec.format.map((f) => f.toUpperCase()).join(", ")}</p>
        <p>최대 파일 크기: 배너 {spec.maxBannerSizeKB}KB · 오브젝트 {spec.maxObjectSizeKB >= 1024 ? `${(spec.maxObjectSizeKB / 1024).toFixed(0)}MB` : `${spec.maxObjectSizeKB}KB`}</p>
        {spec.transparentBg && <p>배경 투명 필수</p>}
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-1.5">
        <Label>상품 이미지</Label>
        <ImageUploader
          onImageSelect={setProductImage}
          maxSizeMB={spec.maxObjectSizeKB >= 1024 ? spec.maxObjectSizeKB / 1024 : 1}
        />
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

      {/* 뱃지 텍스트 */}
      <div className="space-y-1.5">
        <Label htmlFor="badge">뱃지 텍스트 (선택)</Label>
        <Input
          id="badge"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder="예: NEW, SALE, 한정"
        />
      </div>

      {/* 브랜드명 */}
      <div className="space-y-1.5">
        <Label htmlFor="brandName">브랜드명 (선택)</Label>
        <Input
          id="brandName"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="브랜드명을 입력하세요"
        />
      </div>

      {/* 에러 */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* 제출 */}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "생성 중..." : "생성하기"}
      </Button>
    </form>
  );
}
