import React from "react";

import {
    Clock3,
    CalendarDays,
    CircleCheckBig,
    Plane,
} from "lucide-react";


const SummaryCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
}) => {

    return (
        <div
            className="
                rounded-2xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-surface)]
                p-5
                shadow-[var(--shadow-md)]
                transition
                hover:bg-[var(--bg-hover)]
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

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

                    <h3
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-[var(--text-primary)]
                            sm:text-3xl
                        "
                    >
                        {value}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {subtitle}
                    </p>

                </div>


                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--bg-hover)]
                        text-[var(--primary)]
                    "
                >
                    <Icon size={22} />
                </div>

            </div>

        </div>
    );
};


const AttendanceSummary = ({
    summary,
    loading,
}) => {

    if (loading) {

        return (
            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {Array.from({
                    length: 4,
                }).map((_, index) => (

                    <div
                        key={`summary-skeleton-${index}`}
                        className="
                            h-32
                            animate-pulse
                            rounded-2xl
                            bg-[var(--bg-card)]
                        "
                    />

                ))}

            </div>
        );
    }


    if (!summary) {
        return null;
    }


    return (

        <div
            className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >

            <SummaryCard
                icon={Clock3}
                title="Monthly Hours"
                value={`${summary.monthlyHours ?? 0}h`}
                subtitle={`${summary.targetPercentage ?? 0}% of ${summary.targetHours ?? 0}h target`}
            />


            <SummaryCard
                icon={CalendarDays}
                title="Average Daily"
                value={`${summary.averageDailyHours ?? 0}h`}
                subtitle={`${summary.daysPresent ?? 0} days present`}
            />


            <SummaryCard
                icon={CircleCheckBig}
                title="Punctuality Rate"
                value={`${summary.punctualityRate ?? 0}%`}
                subtitle={`${summary.daysLate ?? 0} late days`}
            />


            <SummaryCard
                icon={Plane}
                title="PTO Balance"
                value={`${summary.ptoBalance ?? 0} days`}
                subtitle={`${summary.ptoPending ?? 0} pending`}
            />

        </div>
    );
};


export default AttendanceSummary;