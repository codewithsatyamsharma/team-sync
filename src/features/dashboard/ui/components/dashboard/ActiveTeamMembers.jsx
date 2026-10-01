const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};


const ActiveTeamMembers = ({ team = [] }) => {
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

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h2 className="text-[14px] font-semibold">
          Active Team Members
        </h2>

        <button
          className="
            text-[9px]
            font-medium
            text-[var(--accent)]
            transition
            hover:opacity-75
          "
        >
          View All
        </button>

      </div>


      {/* EMPTY */}

      {!team.length && (
        <div
          className="
            flex
            h-[80px]
            items-center
            justify-center
            text-[11px]
            text-[var(--text-muted)]
          "
        >
          No active team members
        </div>
      )}


      {/* TEAM */}

      {team.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">

          {team.map((member, index) => (

            <div
              key={member._id || member.id || `${member.name}-${index}`}
              className="
                flex
                min-w-[120px]
                items-center
                gap-2
                rounded-md
                bg-[var(--bg-card-secondary)]
                px-2.5
                py-2
                transition-colors
                hover:bg-[var(--bg-hover)]
              "
            >

              {/* AVATAR */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--accent-soft)]
                  text-[9px]
                  font-semibold
                  text-[var(--accent)]
                "
              >
                {getInitials(member.name)}
              </div>


              {/* INFO */}

              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-[9px]
                    font-semibold
                    text-[var(--text-primary)]
                  "
                >
                  {member.name}
                </p>

                <p
                  className="
                    truncate
                    text-[8px]
                    text-[var(--text-muted)]
                  "
                >
                  {member.presence}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
};


export default ActiveTeamMembers;