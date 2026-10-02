const TaskProgress = ({
    chart = [],
}) => {

    const maxValue = Math.max(
        ...chart.map(
            (item) => Number(item.completed) || 0
        ),
        1
    );


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
                    Task Progress
                </h2>


                <span
                    className="
                        rounded-lg
                        bg-[var(--bg-hover)]
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-[var(--text-secondary)]
                    "
                >
                    Last 7 Days
                </span>

            </div>


            {chart.length === 0 ? (

                <div
                    className="
                        flex
                        h-64
                        items-center
                        justify-center
                        text-sm
                        text-[var(--text-muted)]
                    "
                >
                    No task progress available.
                </div>

            ) : (

                <div
                    className="
                        mt-8
                        flex
                        h-64
                        items-end
                        gap-4
                    "
                >

                    {chart.map((item, index) => {

                        const value =
                            Number(item.completed) || 0;

                        const height =
                            `${Math.max(
                                (value / maxValue) * 100,
                                4
                            )}%`;


                        return (
                            <div
                                key={
                                    item.date ||
                                    `${item.label}-${index}`
                                }
                                className="
                                    flex
                                    h-full
                                    flex-1
                                    flex-col
                                    items-center
                                    justify-end
                                "
                            >

                                <div
                                    className="
                                        mb-2
                                        text-xs
                                        font-semibold
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    {value}
                                </div>


                                <div
                                    className="
                                        w-full
                                        max-w-14
                                        rounded-t-lg
                                        bg-[var(--primary)]
                                        opacity-80
                                        transition-all
                                        duration-300
                                    "
                                    style={{
                                        height,
                                    }}
                                />


                                <span
                                    className="
                                        mt-3
                                        text-xs
                                        font-medium
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {item.label}
                                </span>

                            </div>
                        );

                    })}

                </div>

            )}

        </section>
    );
};


export default TaskProgress;