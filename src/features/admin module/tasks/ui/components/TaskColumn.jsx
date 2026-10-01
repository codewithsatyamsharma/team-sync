import React from "react";
import TaskCard from "./TaskCard.jsx";


const TaskColumn = ({
    title,
    tasks,
    onEdit,
    onDelete,
}) => {

    return (
        <section className="min-w-0">

            {/* COLUMN HEADER */}

            <div
                className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    px-1
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <h2
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-[var(--text-secondary)]
                        "
                    >
                        {title}
                    </h2>


                    <span
                        className="
                            flex
                            h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--bg-hover)]
                            px-1.5
                            text-[11px]
                            font-bold
                            text-[var(--text-muted)]
                        "
                    >
                        {tasks.length}
                    </span>

                </div>


                <button
                    type="button"
                    className="
                        rounded-md
                        px-2
                        py-1
                        text-lg
                        leading-none
                        text-[var(--text-muted)]
                        hover:bg-[var(--bg-hover)]
                    "
                >
                    ···
                </button>

            </div>


            {/* TASKS */}

            <div className="space-y-4">

                {tasks.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-[var(--border-color)]
                            p-8
                            text-center
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            No tasks
                        </p>

                    </div>

                ) : (

                    tasks.map((task) => (

                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />

                    ))

                )}

            </div>

        </section>
    );
};


export default TaskColumn;