export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-2 rounded ${className}`} />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl p-6 border border-gold/20">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-5 w-1/2 mb-4" />
      <Skeleton className="h-2 w-full mb-4" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface rounded-xl p-6 border border-gold/20">
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      ))}
    </div>
  );
}
