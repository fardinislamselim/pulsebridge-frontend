import React from "react";
import { CardGridSkeleton } from "@/components/shared/CardGridSkeleton";

interface PublicCardsSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * PublicCardsSkeleton - Reusable skeleton loader for public card directories and feeds
 */
export function PublicCardsSkeleton({
  count = 6,
  columns = 3,
  className,
}: PublicCardsSkeletonProps) {
  return (
    <CardGridSkeleton count={count} columns={columns} className={className} />
  );
}
