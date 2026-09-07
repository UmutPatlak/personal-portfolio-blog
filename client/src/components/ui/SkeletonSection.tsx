
export const SkeletonSection = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center mb-16">
          <div className="h-8 w-64 rounded bg-[var(--color-border)]/50 mb-4" />
          <div className="h-4 w-96 rounded bg-[var(--color-border)]/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
              <div className="h-48 rounded-xl bg-[var(--color-border)]/50" />
              <div className="h-6 w-3/4 rounded bg-[var(--color-border)]/50" />
              <div className="h-4 w-full rounded bg-[var(--color-border)]/50" />
              <div className="h-4 w-5/6 rounded bg-[var(--color-border)]/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
