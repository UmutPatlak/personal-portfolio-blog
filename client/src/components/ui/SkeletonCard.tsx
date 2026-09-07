
export const SkeletonCard = () => {
  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 animate-pulse">
      <div className="flex gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[var(--color-border)]/50" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/3 rounded bg-[var(--color-border)]/50" />
          <div className="h-3 w-1/2 rounded bg-[var(--color-border)]/50" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full rounded bg-[var(--color-border)]/50" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-border)]/50" />
      </div>
    </div>
  );
};
