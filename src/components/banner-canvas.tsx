"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import type { AdType } from "@/types/ad";

interface BannerCanvasProps {
  backgroundImage: string;
  mimeType: string;
  width: number;
  height: number;
  mainCopy: string;
  subCopy?: string;
  badge?: string;
  brandName?: string;
  adType: AdType;
  subtype: string;
  className?: string;
}

function getTextStyle(adType: AdType, subtype: string, width: number, height: number) {
  // Base font sizes scaled relative to banner dimensions
  const scale = Math.min(width / 1029, height / 258);
  const baseFontSize = Math.max(12, Math.round(24 * scale));

  if (adType === "bizboard") {
    return {
      container: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "60%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        padding: `${Math.round(height * 0.12)}px ${Math.round(width * 0.04)}px`,
        gap: `${Math.round(height * 0.06)}px`,
      },
      mainCopy: {
        fontSize: `${Math.round(baseFontSize * 1.4)}px`,
        fontWeight: 700,
        color: "#FFFFFF",
        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      },
      subCopy: {
        fontSize: `${Math.round(baseFontSize * 0.9)}px`,
        fontWeight: 400,
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        lineHeight: 1.4,
      },
      badge: {
        display: "inline-block",
        fontSize: `${Math.round(baseFontSize * 0.7)}px`,
        fontWeight: 700,
        color: "#FFFFFF",
        backgroundColor: "#FF5722",
        padding: `${Math.round(height * 0.02)}px ${Math.round(width * 0.01)}px`,
        borderRadius: `${Math.round(height * 0.04)}px`,
        letterSpacing: "0.02em",
      },
      brandName: {
        fontSize: `${Math.round(baseFontSize * 0.65)}px`,
        fontWeight: 500,
        color: "rgba(255,255,255,0.75)",
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      },
    };
  }

  if (adType === "display") {
    const isVertical = height > width;
    const displayScale = Math.min(width / 800, height / 600);
    const displayBase = Math.max(14, Math.round(28 * displayScale));

    return {
      container: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: isVertical ? "100%" : "55%",
        height: isVertical ? "45%" : "100%",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        padding: `${Math.round(height * 0.08)}px ${Math.round(width * 0.06)}px`,
        gap: `${Math.round(Math.min(width, height) * 0.03)}px`,
      },
      mainCopy: {
        fontSize: `${Math.round(displayBase * 1.5)}px`,
        fontWeight: 700,
        color: "#FFFFFF",
        textShadow: "0 2px 6px rgba(0,0,0,0.5)",
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      },
      subCopy: {
        fontSize: `${Math.round(displayBase * 0.85)}px`,
        fontWeight: 400,
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
        lineHeight: 1.5,
      },
      badge: {
        display: "inline-block",
        fontSize: `${Math.round(displayBase * 0.7)}px`,
        fontWeight: 700,
        color: "#FFFFFF",
        backgroundColor: "#FF5722",
        padding: `${Math.round(height * 0.01)}px ${Math.round(width * 0.02)}px`,
        borderRadius: `${Math.round(Math.min(width, height) * 0.02)}px`,
        letterSpacing: "0.02em",
      },
      brandName: {
        fontSize: `${Math.round(displayBase * 0.6)}px`,
        fontWeight: 500,
        color: "rgba(255,255,255,0.75)",
        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
      },
    };
  }

  // message
  const msgScale = Math.min(width / 800, height / 600);
  const msgBase = Math.max(14, Math.round(26 * msgScale));

  return {
    container: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "50%",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center" as const,
      padding: `${Math.round(height * 0.06)}px ${Math.round(width * 0.06)}px`,
      gap: `${Math.round(height * 0.025)}px`,
    },
    mainCopy: {
      fontSize: `${Math.round(msgBase * 1.4)}px`,
      fontWeight: 700,
      color: "#FFFFFF",
      textShadow: "0 2px 6px rgba(0,0,0,0.5)",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    subCopy: {
      fontSize: `${Math.round(msgBase * 0.85)}px`,
      fontWeight: 400,
      color: "rgba(255,255,255,0.9)",
      textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      lineHeight: 1.5,
    },
    badge: {
      display: "inline-block",
      fontSize: `${Math.round(msgBase * 0.7)}px`,
      fontWeight: 700,
      color: "#FFFFFF",
      backgroundColor: "#FF5722",
      padding: `${Math.round(height * 0.01)}px ${Math.round(width * 0.02)}px`,
      borderRadius: `${Math.round(height * 0.02)}px`,
      letterSpacing: "0.02em",
    },
    brandName: {
      fontSize: `${Math.round(msgBase * 0.6)}px`,
      fontWeight: 500,
      color: "rgba(255,255,255,0.75)",
      textShadow: "0 1px 3px rgba(0,0,0,0.3)",
    },
  };
}

export const BannerCanvas = forwardRef<HTMLDivElement, BannerCanvasProps>(
  function BannerCanvas(
    {
      backgroundImage,
      mimeType,
      width,
      height,
      mainCopy,
      subCopy,
      badge,
      brandName,
      adType,
      subtype,
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const src = backgroundImage.startsWith("data:")
      ? backgroundImage
      : `data:${mimeType};base64,${backgroundImage}`;

    const styles = getTextStyle(adType, subtype, width, height);

    useEffect(() => {
      const updateScale = () => {
        const container = containerRef.current;
        if (!container) return;
        const parentWidth = container.parentElement?.clientWidth ?? width;
        const newScale = Math.min(1, parentWidth / width);
        setScale(newScale);
      };

      updateScale();
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }, [width]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: "100%",
          height: `${height * scale}px`,
          overflow: "hidden",
        }}
      >
        <div
          ref={ref}
          data-banner-canvas
          style={{
            position: "relative",
            width: `${width}px`,
            height: `${height}px`,
            overflow: "hidden",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            fontFamily:
              "'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
            color: "#000000",
            backgroundColor: "transparent",
          }}
        >
          {/* Background image layer */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Text overlay layer */}
          <div style={styles.container}>
            {badge && <span style={styles.badge}>{badge}</span>}
            <div style={styles.mainCopy}>{mainCopy}</div>
            {subCopy && <div style={styles.subCopy}>{subCopy}</div>}
            {brandName && <div style={styles.brandName}>{brandName}</div>}
          </div>
        </div>
      </div>
    );
  }
);
