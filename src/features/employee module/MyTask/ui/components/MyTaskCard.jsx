import {
    CalendarDays,
    Clock3,
    MoreHorizontal,
    Pencil,
} from "lucide-react";


const priorityStyles = {

    high: `
        bg-red-50
        text-red-600
        border-red-100
    `,

    medium: `
        bg-orange-50
        text-orange-600
        border-orange-100
    `,

    low: `
        bg-green-50
        text-green-600
        border-green-100
    `,

};


const statusLabel = {

    todo: "To Do",

    "in_progress": "In Progress",

    "in-progress": "In Progress",

    completed: "Completed",

    done: "Completed",

};


const formatDate = (date) => {

    if (!date) {
        return "No due date";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        }
    ).format(new Date(date));
};


const MyTaskCard = ({
    task,
}) => {

    const priority =
        String(task.priority || "medium").toLowerCase();

    const status =
        String(task.status || "todo").toLowerCase();


    return (

        <div
            className="
                group
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-5
                transition
                hover:-translate-y-[1px]
                hover:shadow-md
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

                <div className="flex flex-wrap items-center gap-2">

                    {task.department && (

                        <span
                            className="
                                rounded-md
                                bg-[var(--bg-hover)]
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                text-[var(--text-secondary)]
                            "
                        >
                            {task.department}
                        </span>

                    )}

                    <span
                        className={`
                            rounded-md
                            border
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${priorityStyles[priority] || priorityStyles.medium}
                        `}
                    >
                        {priority.charAt(0).toUpperCase() +
                            priority.slice(1)}
                    </span>

                </div>


                <button
                    type="button"
                    className="
                        rounded-md
                        p-1.5
                        text-[var(--text-muted)]
                        opacity-0
                        transition
                        group-hover:opacity-100
                        hover:bg-[var(--bg-hover)]
                    "
                >

                    <MoreHorizontal size={18} />

                </button>

            </div>


            {/* TITLE */}

            <h3
                className="
                    mt-4
                    text-base
                    font-bold
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
                        leading-6
                        text-[var(--text-secondary)]
                    "
                >
                    {task.description}
                </p>

            )}


            {/* TAGS */}

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-2
                "
            >

                {task.category && (

                    <span
                        className="
                            rounded
                            bg-[var(--bg-hover)]
                            px-2
                            py-1
                            text-[11px]
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        {task.category}
                    </span>

                )}

                {task.type && (

                    <span
                        className="
                            rounded
                            bg-[var(--bg-hover)]
                            px-2
                            py-1
                            text-[11px]
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        {task.type}
                    </span>

                )}

            </div>


            {/* FOOTER */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[var(--border-color)]
                    pt-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--bg-hover)]
                            text-[10px]
                            font-bold
                            text-[var(--primary)]
                        "
                    >
                        {(
                            task.assignee?.fullName ||
                            task.assignedTo?.fullName ||
                            "ME"
                        )
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>


                    <div>

                        <p
                            className="
                                text-xs
                                font-medium
                                text-[var(--text-primary)]
                            "
                        >
                            {statusLabel[status] || "To Do"}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-4
                        text-xs
                        text-[var(--text-muted)]
                    "
                >

                    {task.dueDate && (

                        <span
                            className="
                                flex
                                items-center
                                gap-1.5
                            "
                        >
                            <CalendarDays size={14} />

                            {formatDate(task.dueDate)}

                        </span>

                    )}


                    {task.estimatedHours && (

                        <span
                            className="
                                flex
                                items-center
                                gap-1.5
                            "
                        >

                            <Clock3 size={14} />

                            {task.estimatedHours}h

                        </span>

                    )}

                </div>

            </div>

        </div>
    );
};


export default MyTaskCard;