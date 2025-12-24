// ============================================
// Skeleton Loader Components
// ============================================

import { Skeleton } from '@/components/ui/skeleton';

export const ChartSkeleton = () => (
  <div className="trading-card p-4 h-full">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-32" />
    </div>
    <Skeleton className="h-[350px] w-full rounded-lg" />
  </div>
);

export const IndicatorSkeleton = () => (
  <div className="trading-card p-4">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-[120px] w-full rounded-lg" />
  </div>
);

export const OrderBlockSkeleton = () => (
  <div className="trading-card p-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-16 w-full rounded" />
        <Skeleton className="h-16 w-full rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-16 w-full rounded" />
        <Skeleton className="h-16 w-full rounded" />
      </div>
    </div>
  </div>
);

export const NewsFeedSkeleton = () => (
  <div className="trading-card h-full flex flex-col">
    <div className="px-4 py-3 border-b border-border">
      <Skeleton className="h-4 w-24 mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export const CalendarSkeleton = () => (
  <div className="trading-card p-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-16 w-full mb-4 rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-14 w-full rounded" />
      <Skeleton className="h-14 w-full rounded" />
      <Skeleton className="h-14 w-full rounded" />
    </div>
  </div>
);

export const CorrelationSkeleton = () => (
  <div className="flex items-center gap-6">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
        <div className="min-w-[70px]">
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-16" />
        <div className="text-right">
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    ))}
  </div>
);
