import {
    ClipboardList,
    Clock3,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";


const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    danger = false,
}) => {

    return (
        <div
            className="
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-5
                shadow-sm
            "
        >

            <div className="flex items-start justify-between">

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            text-[var(--text-muted)]
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        {value}
                    </p>

                </div>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg

                        ${
                            danger
                                ? "bg-red-100 text-red-500"
                                : "bg-[var(--bg-hover)] text-[var(--primary)]"
                        }
                    `}
                >

                    <Icon size={20} />

                </div>

            </div>

            <p
                className="
                    mt-3
                    text-xs
                    text-[var(--text-muted)]
                "
            >
                {description}
            </p>

        </div>
    );
};


const TaskStats = ({ tasks }) => {

    const today = new Date();

    const activeTasks = tasks.filter(
        (task) =>
            task.status !== "completed" &&
            task.status !== "done"
    );

    const inProgress = tasks.filter(
        (task) =>
            task.status === "in_progress" ||
            task.status === "in-progress"
    );

    const completed = tasks.filter(
        (task) =>
            task.status === "completed" ||
            task.status === "done"
    );

    const overdue = tasks.filter((task) => {

        if (!task.dueDate) {
            return false;
        }

        const dueDate = new Date(task.dueDate);

        return (
            dueDate < today &&
            task.status !== "completed" &&
            task.status !== "done"
        );
    });


    return (

        <div
            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >

            <StatCard
                icon={ClipboardList}
                title="Assigned to Me"
                value={activeTasks.length}
                description="Active tasks assigned to you"
            />

            <StatCard
                icon={Clock3}
                title="In Progress"
                value={inProgress.length}
                description="Tasks currently in progress"
            />

            <StatCard
                icon={CheckCircle2}
                title="Completed"
                value={completed.length}
                description="Completed tasks"
            />

            <StatCard
                icon={AlertCircle}
                title="Attention Needed"
                value={overdue.length}
                description="Overdue tasks"
                danger={overdue.length > 0}
            />

        </div>
    );
};


export default TaskStats;