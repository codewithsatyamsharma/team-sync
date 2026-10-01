const TaskProgress = ({ chart = [] }) => {
  // Tallest day = 100% height. Math.max(..., 1) avoids dividing by 0.
  const max = Math.max(...chart.map((item) => item.completed), 1);

  return (
    <section
      className="
        rounded-[var(--radius-md)]
        border
        border-[var(--border-color)]
        bg-[var(--bg-card)]
        p-4
        shadow-[var(--shadow-md)]
      "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Task Progress</h2>

        <button
          className="
            rounded-md
            bg-[var(--bg-card-secondary)]
            px-3
            py-1.5
            text-[9px]
            text-[var(--text-secondary)]
          "
        >
          Last 7 Days
        </button>
      </div>

      <div className="mt-7 flex h-[190px] items-end gap-3 px-1">
        {chart.map((item) => (
          <div
            key={item.date}
            className="flex h-full min-w-0 flex-1 flex-col justify-end"
          >
            <div className="flex h-full items-end">
              <div
                title={`${item.completed} completed`}
                className="w-full rounded-t-[5px] bg-[var(--chart-bar)] transition-all"
                style={{
                  height: `${(item.completed / max) * 100}%`,
                  minHeight: "4px",
                }}
              />
            </div>

            <span className="mt-3 text-center text-[9px] text-[var(--text-muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskProgress;