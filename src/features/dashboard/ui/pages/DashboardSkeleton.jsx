export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">

      {/* HEADER */}

      <div className="mb-6">
        <div className="h-7 w-72 rounded bg-[var(--bg-card)]" />

        <div className="mt-2 h-4 w-96 rounded bg-[var(--bg-card)]" />
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-[105px]
              rounded-[var(--radius-md)]
              bg-[var(--bg-card)]
            "
          />
        ))}
      </div>

      {/* CONTENT */}

      <div className="mt-5 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <div className="h-[310px] rounded-[var(--radius-md)] bg-[var(--bg-card)]" />
          <div className="h-[120px] rounded-[var(--radius-md)] bg-[var(--bg-card)]" />
        </div>

        <div className="space-y-5">
          <div className="h-[310px] rounded-[var(--radius-md)] bg-[var(--bg-card)]" />
          <div className="h-[165px] rounded-[var(--radius-md)] bg-[var(--bg-card)]" />
        </div>
      </div>

    </div>
  );
};