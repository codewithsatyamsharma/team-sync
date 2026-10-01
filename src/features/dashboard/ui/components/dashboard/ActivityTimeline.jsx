import {
  Pencil,
  CircleCheck,
  UserPlus,
  AlertTriangle,
  Activity,
} from "lucide-react";


const activityConfig = {
  update: {
    icon: Pencil,
    className: "bg-[#7656a5] text-white",
  },

  complete: {
    icon: CircleCheck,
    className: "bg-[var(--success)] text-white",
  },

  member: {
    icon: UserPlus,
    className: "bg-[var(--warning)] text-white",
  },

  alert: {
    icon: AlertTriangle,
    className: "bg-[var(--danger)] text-white",
  },

  default: {
    icon: Activity,
    className: "bg-[var(--accent)] text-white",
  },
};


const formatTime = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  return `${days} days ago`;
};


const ActivityTimeline = ({ activities = [] }) => {

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

      <h2 className="text-[14px] font-semibold">
        Activity Timeline
      </h2>


      {/* EMPTY */}

      {!activities.length && (
        <div
          className="
            flex
            h-[250px]
            items-center
            justify-center
            text-[11px]
            text-[var(--text-muted)]
          "
        >
          No recent activity
        </div>
      )}


      {/* ACTIVITIES */}

      {activities.length > 0 && (
        <div className="mt-5">

          {activities.map((activity, index) => {

            const config =
              activityConfig[activity.type] ||
              activityConfig.default;

            const Icon = config.icon;


            return (
              <div
                key={`${activity.createdAt}-${index}`}
                className="
                  relative
                  flex
                  gap-3
                  pb-5
                  last:pb-0
                "
              >

                {/* LINE */}

                {index !== activities.length - 1 && (
                  <span
                    className="
                      absolute
                      left-[11px]
                      top-6
                      h-[calc(100%-8px)]
                      w-px
                      bg-[var(--border-color)]
                    "
                  />
                )}


                {/* ICON */}

                <div
                  className={`
                    relative
                    z-10
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${config.className}
                  `}
                >
                  <Icon size={11} />
                </div>


                {/* CONTENT */}

                <div className="min-w-0 pt-0.5">

                  <p
                    className="
                      text-[10px]
                      font-medium
                      leading-[1.4]
                      text-[var(--text-secondary)]
                    "
                  >
                    {activity.text}

                    {activity.target && (
                      <>
                        {" "}
                        <span className="font-semibold text-[var(--accent)]">
                          {activity.target}
                        </span>
                      </>
                    )}
                  </p>


                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[var(--text-muted)]
                    "
                  >
                    {formatTime(activity.createdAt)}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
};


export default ActivityTimeline;