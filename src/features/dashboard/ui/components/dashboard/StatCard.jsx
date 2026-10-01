const StatCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-[var(--radius-md)]
        border
        border-[var(--border-color)]
        bg-[var(--bg-card)]
        p-4
        shadow-[var(--shadow-md)]
        transition-all
        duration-300
        hover:bg-[var(--bg-hover)]
      "
    >

      {/* TOP */}

      <div className="flex items-start justify-between">

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            bg-[var(--accent-soft)]
            text-[var(--accent)]
          "
        >
          <Icon size={15} strokeWidth={1.8} />
        </div>


        {/* CHANGE */}

        {(change !== null && change !== undefined) && (
          <span
            className="
              text-[9px]
              font-semibold
              text-[var(--text-secondary)]
            "
          >
            +{change}%
          </span>
        )}

        {changeLabel && (
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              text-[var(--text-secondary)]
            "
          >
            {changeLabel}

            {change !== null &&
              change !== undefined &&
              ` ${change}`}
          </span>
        )}

      </div>


      {/* CONTENT */}

      <div className="mt-4">

        <p
          className="
            text-[10px]
            font-medium
            text-[var(--text-muted)]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[19px]
            font-semibold
            leading-none
            text-[var(--text-primary)]
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
};

export default StatCard;