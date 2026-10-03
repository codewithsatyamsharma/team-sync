import React, {
    useMemo,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


const statusDot = {
    present:
        "bg-[var(--success)]",

    late:
        "bg-[var(--warning)]",

    half_day:
        "bg-[var(--warning)]",

    absent:
        "bg-[var(--danger)]",

    on_leave:
        "bg-[var(--primary)]",

    holiday:
        "bg-[var(--text-muted)]",
};


const AttendanceCalendar = ({
    month,
    calendar,
    onPreviousMonth,
    onNextMonth,
}) => {

    const monthDate =
        new Date(`${month}-01T00:00:00`);


    const monthName =
        monthDate.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric",
            }
        );


    const recordMap = useMemo(() => {

        const map = {};

        calendar.forEach((item) => {

            map[item.date] = item;

        });

        return map;

    }, [calendar]);


    const firstDay =
        new Date(
            monthDate.getFullYear(),
            monthDate.getMonth(),
            1
        ).getDay();


    const daysInMonth =
        new Date(
            monthDate.getFullYear(),
            monthDate.getMonth() + 1,
            0
        ).getDate();


    const cells = [];

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {
        cells.push(null);
    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            `${monthDate.getFullYear()}-${String(
                monthDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;

        cells.push({
            day,
            date,
            record:
                recordMap[date],
        });
    }


    return (

        <section
            className="
                rounded-2xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-surface)]
                p-6
                shadow-[var(--shadow-md)]
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        Attendance Calendar
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        Monthly overview
                    </p>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-1
                    "
                >

                    <button
                        type="button"
                        onClick={
                            onPreviousMonth
                        }
                        className="
                            rounded-lg
                            p-2
                            text-[var(--text-secondary)]
                            hover:bg-[var(--bg-hover)]
                        "
                    >
                        <ChevronLeft
                            size={19}
                        />
                    </button>


                    <span
                        className="
                            min-w-32
                            text-center
                            text-sm
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        {monthName}
                    </span>


                    <button
                        type="button"
                        onClick={
                            onNextMonth
                        }
                        className="
                            rounded-lg
                            p-2
                            text-[var(--text-secondary)]
                            hover:bg-[var(--bg-hover)]
                        "
                    >
                        <ChevronRight
                            size={19}
                        />
                    </button>

                </div>

            </div>


            {/* WEEKDAYS */}

            <div
                className="
                    mt-6
                    grid
                    grid-cols-7
                    gap-1
                "
            >

                {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                ].map((day) => (

                    <div
                        key={day}
                        className="
                            py-2
                            text-center
                            text-xs
                            font-bold
                            text-[var(--text-muted)]
                        "
                    >
                        {day}
                    </div>

                ))}

            </div>


            {/* DAYS */}

            <div
                className="
                    grid
                    grid-cols-7
                    gap-1
                "
            >

                {cells.map((cell, index) => {

                    if (!cell) {

                        return (
                            <div
                                key={`empty-${index}`}
                                className="
                                    aspect-square
                                "
                            />
                        );
                    }


                    const record =
                        cell.record;


                    const isToday =
                        cell.date ===
                        new Date()
                            .toISOString()
                            .slice(0, 10);


                    return (

                        <div
                            key={cell.date}
                            className={`
                                relative
                                flex
                                aspect-square
                                flex-col
                                items-center
                                justify-center
                                rounded-lg
                                ${
                                    isToday
                                        ? "ring-2 ring-[var(--primary)]"
                                        : ""
                                }
                            `}
                        >

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    text-[var(--text-primary)]
                                "
                            >
                                {cell.day}
                            </span>


                            {record && (

                                <span
                                    title={
                                        record.name ||
                                        record.status
                                    }
                                    className={`
                                        mt-1
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${
                                            statusDot[
                                                record.status
                                            ] ||
                                            statusDot.present
                                        }
                                    `}
                                />

                            )}

                        </div>
                    );

                })}

            </div>


            {/* LEGEND */}

            <div
                className="
                    mt-6
                    flex
                    flex-wrap
                    gap-x-4
                    gap-y-2
                "
            >

                {Object.entries(
                    statusDot
                ).map(
                    ([
                        status,
                        className,
                    ]) => (

                        <div
                            key={status}
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className={`
                                    h-2
                                    w-2
                                    rounded-full
                                    ${className}
                                `}
                            />

                            <span
                                className="
                                    text-xs
                                    capitalize
                                    text-[var(--text-muted)]
                                "
                            >
                                {status.replaceAll(
                                    "_",
                                    " "
                                )}
                            </span>

                        </div>

                    )
                )}

            </div>

        </section>
    );
};


export default AttendanceCalendar;