import {
    AlertTriangle,
    CheckCircle2,
    Edit3,
    UserPlus,
} from "lucide-react";


const ActivityIcon = ({ type }) => {

    if (type === "completed") {
        return <CheckCircle2 size={16} />;
    }

    if (type === "member") {
        return <UserPlus size={16} />;
    }

    if (type === "alert") {
        return <AlertTriangle size={16} />;
    }

    return <Edit3 size={16} />;
};


const getTime = (createdAt) => {

    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const diff =
        Date.now() - date.getTime();

    const minutes =
        Math.floor(diff / 60000);

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours =
        Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days =
        Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
};


const ActivityTimeline = ({
    activities = [],
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

            <h2
                className="
                    text-lg
                    font-bold
                    text-[var(--text-primary)]
                "
            >
                Activity Timeline
            </h2>


            <div className="mt-6 space-y-6">

                {activities.length === 0 ? (

                    <p
                        className="
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        No recent activity.
                    </p>

                ) : (

                    activities.map((activity, index) => (

                        <div
                            key={
                                activity._id ||
                                activity.id ||
                                `${activity.createdAt}-${index}`
                            }
                            className="flex gap-3"
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[var(--bg-hover)]
                                    text-[var(--primary)]
                                "
                            >
                                <ActivityIcon
                                    type={activity.type}
                                />
                            </div>


                            <div className="min-w-0">

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        leading-5
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {activity.text}{" "}

                                    {activity.target && (
                                        <span
                                            className="
                                                font-semibold
                                                text-[var(--primary)]
                                            "
                                        >
                                            {activity.target}
                                        </span>
                                    )}

                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {getTime(
                                        activity.createdAt
                                    )}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </section>
    );
};


export default ActivityTimeline;