"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BannerPreviewProps {
  imageBase64: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
  specCompliant: boolean;
  warnings: string[];
  className?: string;
}

interface SpecItem {
  label: string;
  ok: boolean;
  value: string;
}

export function BannerPreview({
  imageBase64,
  mimeType,
  width,
  height,
  fileSizeKB,
  specCompliant,
  warnings,
  className,
}: BannerPreviewProps) {
  const format = mimeType.split("/")[1]?.toUpperCase() ?? "IMAGE";
  const src = imageBase64.startsWith("data:")
    ? imageBase64
    : `data:${mimeType};base64,${imageBase64}`;

  const specs: SpecItem[] = [
    {
      label: "크기",
      ok: width > 0 && height > 0,
      value: `${width} × ${height}px`,
    },
    {
      label: "포맷",
      ok: format === "PNG" || format === "JPEG" || format === "JPG",
      value: format,
    },
    {
      label: "용량",
      ok: fileSizeKB < 500,
      value: `${fileSizeKB.toFixed(0)}KB`,
    },
  ];

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="rounded-lg border bg-muted/30 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="생성된 배너"
          className="w-full object-contain rounded max-h-64"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={specCompliant ? "default" : "destructive"}>
          {specCompliant ? "규격 적합" : "규격 불일치"}
        </Badge>
        {specs.map((s) => (
          <div
            key={s.label}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
              s.ok
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
            )}
          >
            <span>{s.ok ? "✓" : "✗"}</span>
            <span>
              {s.label}: {s.value}
            </span>
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-1">
          {warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <span className="mt-0.5">⚠</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
