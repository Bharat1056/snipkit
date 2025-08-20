'use client';

import { Card } from '@/components/ui/card';

interface CardLoadingGridProps {
  rows?: number;
  cols?: number;
}

export function CardLoadingGrid({ rows = 2, cols = 3 }: CardLoadingGridProps) {
  const totalCards = rows * cols;

  return (
    <div
      className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols}`}
    >
      {Array.from({ length: totalCards }).map((_, i) => (
        <Card key={i} className="rounded-xl p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="flex items-center gap-3 pt-2">
              <div className="h-4 w-10 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
