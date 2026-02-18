"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CopyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  forbiddenChars?: string[];
  placeholder?: string;
  className?: string;
}

export function CopyInput({
  label,
  value,
  onChange,
  maxLength,
  forbiddenChars = [],
  placeholder,
  className,
}: CopyInputProps) {
  const remaining = maxLength - value.length;
  const usageRatio = value.length / maxLength;

  const foundForbidden = forbiddenChars.filter((ch) => value.includes(ch));
  const hasForbidden = foundForbidden.length > 0;

  const counterColor =
    hasForbidden || remaining < 0
      ? "text-destructive"
      : usageRatio >= 0.9
      ? "text-amber-500"
      : usageRatio >= 0.7
      ? "text-amber-400"
      : "text-green-600 dark:text-green-400";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className={cn("text-xs tabular-nums transition-colors", counterColor)}>
          {value.length} / {maxLength}
        </span>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={cn(
          "resize-none",
          hasForbidden && "border-destructive focus-visible:ring-destructive/30"
        )}
      />

      {hasForbidden && (
        <p className="text-xs text-destructive">
          사용 불가 문자 포함:{" "}
          <span className="font-medium">{foundForbidden.join(", ")}</span>
        </p>
      )}

      {remaining < 0 && !hasForbidden && (
        <p className="text-xs text-destructive">
          최대 {maxLength}자를 초과했습니다. ({Math.abs(remaining)}자 초과)
        </p>
      )}
    </div>
  );
}
