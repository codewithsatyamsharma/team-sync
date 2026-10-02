import TaskCard from "./TaskCard.jsx";


const TaskColumn = ({
    title,
    tasks,
    onEdit,
    onDelete,
}) => {

    return (
        <section className="min-w-0">

            <div
                className="
                    mb-5
                    flex
                    items-center
                    gap-2
                "
            >

                <h2
                    className="
                        text-sm
                        font-bold
                        uppercase
                        tracking-wide
                        text-[var(--text-secondary)]
                    "
                >
                    {title}
                </h2>


                <span
                    className="
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--bg-hover)]
                        px-2
                        text-xs
                        font-bold
                        text-[var(--text-muted)]
                    "
                >
                    {tasks.length}
                </span>

            </div>


            <div className="space-y-5">

                {tasks.length === 0 ? (

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-[var(--border-color)]
                            p-10
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