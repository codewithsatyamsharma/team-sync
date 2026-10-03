const SprintDistribution = ({
    tasks,
}) => {

    const total =
        tasks.length || 1;


    const engineering =
        tasks.filter(
            (task) =>
                String(task.department)
                    .toLowerCase() === "engineering"
        ).length;


    const design =
        tasks.filter(
            (task) =>
                String(task.department)
                    .toLowerCase() === "design"
        ).length;


    const other =
        Math.max(
            tasks.length -
            engineering -
            design,
            0
        );


    const items = [

        {
            label: "Engineering",
            value: engineering,
        },

        {
            label: "Design",
            value: design,
        },

        {
            label: "Other",
            value: other,
        },

    ];


    return (

        <div
            className="
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-5
            "
        >

            <h3
                className="
                    text-base
                    font-bold
                    text-[var(--text-primary)]
                "
            >
                Sprint Distribution
            </h3>


            <div className="mt-5 space-y-5">

                {items.map((item) => {

                    const percentage =
                        Math.round(
                            (item.value / total) * 100
                        );

                    return (

                        <div key={item.label}>

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    text-xs
                                "
                            >

                                <span
                                    className="
                                        font-medium
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    {item.label}
                                </span>

                                <span
                                    className="
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {percentage}%
                                </span>

                            </div>


                            <div
                                className="
                                    mt-2
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-[var(--bg-hover)]
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-[var(--primary)]
                                        transition-all
                                    "
                                    style={{
                                        width:
                                            `${percentage}%`,
                                    }}
                                />

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
};


export default SprintDistribution;