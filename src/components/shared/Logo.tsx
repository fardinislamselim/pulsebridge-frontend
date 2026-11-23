import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
  textClassName?: string;
}

/**
 * PulseBridge Brand Logo - Pure Server Component
 * Scalable SVG blood drop + heartbeat pulse icon with medical typography.
 */
export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className,
  textClassName,
}: LogoProps) {
  const sizeConfig = {
    sm: {
      iconSize: "h-7 w-7",
      svgSize: 28,
      textSize: "text-lg",
      subtextSize: "text-[9px]",
      gap: "gap-2",
    },
    md: {
      iconSize: "h-9 w-9",
      svgSize: 36,
      textSize: "text-xl",
      subtextSize: "text-[10px]",
      gap: "gap-2.5",
    },
    lg: {
      iconSize: "h-12 w-12",
      svgSize: 48,
      textSize: "text-2xl sm:text-3xl",
      subtextSize: "text-xs",
      gap: "gap-3",
    },
  }[size];

  const content = (
    <div className={cn("inline-flex items-center", sizeConfig.gap, className)}>
      {/* Icon: Medical Blood Drop + Heartbeat Pulse */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white transition-transform hover:scale-105",
          sizeConfig.iconSize
        )}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full p-1.5"
          aria-hidden="true"
        >
          {/* Blood Drop Base Outline */}
          <path
            d="M20 4C20 4 8 18 8 26C8 32.6274 13.3726 38 20 38C26.6274 38 32 32.6274 32 26C32 18 20 4 20 4Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Continuous ECG Vital Pulse Wave */}
          <path
            d="M10 26.5H15L17.5 19L21.5 32L24.5 22L26.5 26.5H30"
            stroke="white"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top Vital Accent Point */}
          <circle cx="20" cy="11" r="1.75" fill="white" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={cn(
              "font-heading font-extrabold tracking-tight text-slate-900 dark:text-white",
              sizeConfig.textSize,
              textClassName
            )}
          >
            Pulse<span className="text-red-600 dark:text-red-500">Bridge</span>
          </span>
          <span
            className={cn(
              "font-sans font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5",
              sizeConfig.subtextSize
            )}
          >
            Blood & Emergency Network
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg"
        aria-label="PulseBridge Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
