const getInitials = (name = "") => {

    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};


const ActiveTeamMembers = ({
    team = [],
}) => {

    return (
        <section
            className="
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-6
                shadow-[var(--shadow-md)]
            "
        >

            <div className="flex items-center justify-between">

                <h2
                    className="
                        text-lg
                        font-bold
                        text-[var(--text-primary)]
                    "
                >
                    Active Team Members
                </h2>


                <button
                    type="button"
                    className="
                        text-sm
                        font-semibold
                        text-[var(--primary)]
                    "
                >
                    View All
                </button>

            </div>


            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-3
                "
            >

                {team.length === 0 ? (

                    <p
                        className="
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        No team members available.
                    </p>

                ) : (

                    team.map((member, index) => (

                        <div
                            key={
                                member._id ||
                                member.id ||
                                member.name ||
                                index
                            }
                            className="
                                flex
                                min-w-40
                                items-center
                                gap-3
                                rounded-xl
                                bg-[var(--bg-hover)]
                                px-3
                                py-3
                            "
                        >

                            {member.avatar ? (

                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="
                                        h-10
                                        w-10
                                        rounded-full
                                        object-cover
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[var(--primary)]
                                        text-xs
                                        font-bold
                                        text-white
                                    "
                                >
                                    {getInitials(
                                        member.name
                                    )}
                                </div>

                            )}


                            <div className="min-w-0">

                                <p
                                    className="
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {member.name}
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {member.presence ||
                                        "Available"}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>
    );
};


export default ActiveTeamMembers;