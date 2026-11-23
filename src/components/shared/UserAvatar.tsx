"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: {
    name?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
    email?: string | null;
  } | null;
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-xs sm:text-sm",
  lg: "h-11 w-11 text-base sm:text-lg",
  xl: "h-14 w-14 text-xl sm:text-2xl",
};

/**
 * UserAvatar - Robust avatar renderer with image loading error fallback
 * Displays user avatar if valid image is available, otherwise renders a stylized initial badge.
 */
export function UserAvatar({
  user,
  src,
  name,
  size = "md",
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const imageSource = src || user?.avatar || user?.avatarUrl;
  const displayName = name || user?.name || user?.email || "User";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  if (imageSource && !hasError) {
    return (
      <div
        className={cn(
 "relative shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800",
 sizeClasses[size],
 className
 )}
      >
        <Image
          src={imageSource}
          alt={displayName}
          fill
          sizes="(max-width: 768px) 48px, 64px"
          className="object-cover"
          onError={() => setHasError(true)}
          unoptimized={imageSource.startsWith("data:") || imageSource.includes("localhost")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
 "flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold uppercase text-slate-700 select-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200",
 sizeClasses[size],
 fallbackClassName,
 className
 )}
      title={displayName}
    >
      <span>{initial}</span>
    </div>
  );
}
