import React from "react";

interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = "OR CONTINUE WITH" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-6 w-full">
      <div className="h-px flex-1 bg-border" />
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
