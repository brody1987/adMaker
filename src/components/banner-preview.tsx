"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BannerCanvas } from "@/components/banner-canvas";
import type { AdType, TextOverlayData } from "@/types/ad";

interface BannerPreviewProps {
  backgroundImage: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
  specCompliant: boolean;
  warnings: string[];
  textOverlay: TextOverlayData;
  adType: AdType;
  subtype: string;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

interface SpecItem {
  label: string;
  ok: boolean;
  value: string;
}

export function BannerPreview({
  backgroundImage,
  mimeType,
  width,
  height,
  fileSizeKB,
  specCompliant,
  warnings,
  textOverlay,
  adType,
  subtype,
  canvasRef,
  className,
}: BannerPreviewProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = canvasRef ?? internalRef;

  const format = mimeType.split("/")[1]?.toUpperCase() ?? "IMAGE";

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
      <div className="rounded-lg border bg-muted/30 p-3 overflow-hidden">
        <BannerCanvas
          ref={ref}
          backgroundImage={backgroundImage}
          mimeType={mimeType}
          width={width}
          height={height}
          mainCopy={textOverlay.mainCopy}
          subCopy={textOverlay.subCopy}
          badge={textOverlay.badge}
          brandName={textOverlay.brandName}
          adType={adType}
          subtype={subtype}
          className="[&>div]:scale-[var(--preview-scale)] origin-top-left"
        />
        <style>{`
          .rounded-lg > div > div {
            --preview-scale: 1;
          }
          @media (max-width: 768px) {
            .rounded-lg > div > div {
              --preview-scale: 0.5;
            }
          }
        `}</style>
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
