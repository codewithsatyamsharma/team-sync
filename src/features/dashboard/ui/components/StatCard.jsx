import {
    CheckCircle2,
    ClipboardList,
    Rocket,
    Users,
} from "lucide-react";


const icons = {
    totalTasks: ClipboardList,
    completedTasks: CheckCircle2,
    activeProjects: Rocket,
    teamMembers: Users,
};


const StatCard = ({
    type,
    title,
    value,
    change,
    extra,
}) => {

    const Icon =
        icons[type] || ClipboardList;


    return (
        <div
            className="
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-5
                shadow-[var(--shadow-md)]
                transition-colors
            "
        >

            <div className="flex items-start justify-between">

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--bg-hover)]
                        text-[var(--primary)]
                    "
                >
                    <Icon size={19} />
                </div>


                <div className="text-right">

                    {change !== undefined && (
                        <span
                            className="
                                text-xs
                                font-semibold
                                text-[var(--text-secondary)]
                            "
                        >
                            +{change}%
                        </span>
                    )}

                    {extra && (
                        <span
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                text-[var(--text-secondary)]
                            "
                        >
                            {extra}
                        </span>
                    )}

                </div>

            </div>


            <div className="mt-5">

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
                        mt-1
                        text-3xl
                        font-bold
                        text-[var(--text-primary)]
                    "
                >
                    {value}
                </p>

            </div>

        </div>
    );
};


export default StatCard;
