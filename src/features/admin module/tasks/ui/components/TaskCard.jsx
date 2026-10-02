import {
    CalendarDays,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";


const priorityClasses = {
    low: `
        bg-green-100
        text-green-700
        dark:bg-green-900/30
        dark:text-green-400
    `,

    medium: `
        bg-orange-100
        text-orange-700
        dark:bg-orange-900/30
        dark:text-orange-400
    `,

    high: `
        bg-red-100
        text-red-700
        dark:bg-red-900/30
        dark:text-red-400
    `,
};


const getInitials = (name = "") => {

    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};


const TaskCard = ({
    task,
    onEdit,
    onDelete,
}) => {

    const priority =
        task.priority?.toLowerCase() ||
        "medium";


    const assignee =
        task.assignees?.[0];


    return (
        <article
            className="
                group
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-surface)]
                p-5
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-[var(--shadow-md)]
            "
        >

            {/* TOP */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <span
                    className="
                        rounded-lg
                        bg-[var(--bg-hover)]
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        text-[var(--primary)]
                    "
                >
                    {task.department || "General"}
                </span>


                <div
                    className="
                        flex
                        gap-1
                        opacity-0
                        transition
                        group-hover:opacity-100
                    "
                >

                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="
                            rounded-lg
                            p-2
                            text-[var(--text-muted)]
                            hover:bg-[var(--bg-hover)]
                            hover:text-[var(--primary)]
                        "
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>


                    <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="
                            rounded-lg
                            p-2
                            text-[var(--text-muted)]
                            hover:bg-red-100
                            hover:text-red-600
                            dark:hover:bg-red-900/30
                        "
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>

                </div>

            </div>


            {/* TITLE */}

            <h3
                className="
                    mt-5
                    text-lg
                    font-bold
                    text-[var(--text-primary)]
                "
            >
                {task.title}
            </h3>


            {/* DESCRIPTION */}

            {task.description && (
                <p
                    className="
                        mt-2
                        line-clamp-2
                        text-sm
                        leading-6
                        text-[var(--text-secondary)]
                    "
                >
                    {task.description}
                </p>
            )}


            {/* PROGRESS */}

            {task.status === "in-progress" && (
                <div className="mt-5">

                    <div
                        className="
                            h-1.5
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
                            "
                            style={{
                                width: `${Math.min(
                                    Number(task.progress) || 0,
                                    100
                                )}%`,
                            }}
                        />

                    </div>

                </div>
            )}


            {/* FOOTER */}

            <div
                className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <div className="flex items-center gap-2">

                    {assignee?.avatar ? (

                        <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="
                                h-9
                                w-9
                                rounded-full
                                object-cover
                            "
                        />

                    ) : (

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--bg-hover)]
                                text-xs
                                font-bold
                                text-[var(--primary)]
                            "
                        >
                            {getInitials(
                                assignee?.name ||
                                task.createdByName ||
                                "User"
                            )}
                        </div>

                    )}

                </div>


                <div className="flex items-center gap-3">

                    {task.dueDate && (
                        <span
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-[var(--text-muted)]
                            "
                        >
                            <CalendarDays size={14} />

                            {new Date(
                                task.dueDate
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </span>
                    )}


                    <span
                        className={`
                            rounded-lg
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            ${priorityClasses[priority]}
                        `}
                    >
                        {priority}
                    </span>

                </div>

            </div>

        </article>
    );
};


export default TaskCard;