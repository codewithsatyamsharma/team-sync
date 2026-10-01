import React from "react";


const getInitials = (name = "") => {

    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};


const priorityStyles = {
    high: {
        bg: "bg-red-500/10",
        text: "text-red-500",
    },

    medium: {
        bg: "bg-orange-500/10",
        text: "text-orange-500",
    },

    low: {
        bg: "bg-green-500/10",
        text: "text-green-500",
    },
};


const departmentStyles = {

    engineering:
        "bg-indigo-500/10 text-indigo-500",

    design:
        "bg-orange-500/10 text-orange-500",

    marketing:
        "bg-pink-500/10 text-pink-500",

    research:
        "bg-slate-500/10 text-slate-500",

    operations:
        "bg-green-500/10 text-green-500",
};


const TaskCard = ({
    task,
    onEdit,
    onDelete,
}) => {

    const priority =
        priorityStyles[
            task.priority?.toLowerCase()
        ] || priorityStyles.medium;


    const department =
        departmentStyles[
            task.department?.toLowerCase()
        ] ||
        "bg-[var(--bg-hover)] text-[var(--text-secondary)]";


    const formattedDate = task.dueDate
        ? new Date(
            task.dueDate
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
            }
        )
        : null;


    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${task.title}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await onDelete(task._id);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete task."
            );

        }
    };


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
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[var(--shadow-md)]
            "
        >

            {/* TOP ROW */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <span
                    className={`
                        inline-flex
                        rounded-md
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${department}
                    `}
                >
                    {task.department || "General"}
                </span>


                {/* MENU */}

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
                        onClick={() =>
                            onEdit(task)
                        }
                        className="
                            rounded-md
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-[var(--text-muted)]
                            hover:bg-[var(--bg-hover)]
                            hover:text-[var(--primary)]
                        "
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        onClick={handleDelete}
                        className="
                            rounded-md
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-[var(--danger)]
                            hover:bg-red-500/10
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>


            {/* TITLE */}

            <h3
                className="
                    mt-4
                    text-base
                    font-semibold
                    leading-6
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
                        leading-5
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
                            mb-2
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <span
                            className="
                                text-xs
                                font-medium
                                text-[var(--text-muted)]
                            "
                        >
                            Progress
                        </span>

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-[var(--primary)]
                            "
                        >
                            {task.progress || 0}%
                        </span>

                    </div>


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
                                transition-all
                            "
                            style={{
                                width: `${
                                    task.progress || 0
                                }%`,
                            }}
                        />

                    </div>

                </div>
            )}


            {/* BOTTOM */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                "
            >

                {/* ASSIGNEES */}

                <div
                    className="
                        flex
                        items-center
                        -space-x-2
                    "
                >

                    {task.assignees
                        ?.slice(0, 4)
                        .map((user) => (

                            <div
                                key={user._id}
                                title={user.name}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-[var(--bg-surface)]
                                    bg-[var(--bg-hover)]
                                    text-[10px]
                                    font-bold
                                    text-[var(--primary)]
                                "
                            >

                                {user.avatar ? (

                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="
                                            h-full
                                            w-full
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    getInitials(
                                        user.name
                                    )

                                )}

                            </div>

                        ))}

                </div>


                {/* RIGHT SIDE */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {formattedDate && (
                        <span
                            className="
                                text-xs
                                font-medium
                                text-[var(--text-muted)]
                            "
                        >
                            {formattedDate}
                        </span>
                    )}


                    <span
                        className={`
                            rounded-md
                            px-2
                            py-1
                            text-[11px]
                            font-semibold
                            capitalize
                            ${priority.bg}
                            ${priority.text}
                        `}
                    >
                        {task.priority || "medium"}
                    </span>

                </div>

            </div>

        </article>
    );
};


export default TaskCard;