"use client";

import { useCallback, useRef, useState } from "react";
import { cn, fileToBase64, formatFileSize } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  onImageSelect,
  maxSizeMB = 10,
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
        return;
      }

      const base64 = await fileToBase64(file);
      setPreview(base64);
      setFileInfo({ name: file.name, size: file.size, type: file.type });
      onImageSelect(base64);
    },
    [maxSizeMB, onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClick = () => inputRef.current?.click();

  const handleRemove = () => {
    setPreview(null);
    setFileInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="업로드된 이미지"
              className="w-full max-h-48 object-contain rounded"
            />
          </div>
          {fileInfo && (
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate max-w-[200px]">{fileInfo.name}</span>
              <span>
                {formatFileSize(fileInfo.size)} · {fileInfo.type.split("/")[1].toUpperCase()}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="mt-2 w-full rounded-md border border-dashed py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            다른 이미지 선택
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <div className="text-3xl">🖼️</div>
          <div className="text-sm font-medium">이미지를 드래그하거나 클릭하여 업로드</div>
          <div className="text-xs text-muted-foreground">
            PNG, JPG 지원 · 최대 {maxSizeMB}MB
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
