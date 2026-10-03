import React from "react";

import {
    Clock,
    CalendarDays,
} from "lucide-react";


const statusClasses = {
    present:
        "bg-[var(--success)]/10 text-[var(--success)]",

    late:
        "bg-[var(--warning)]/10 text-[var(--warning)]",

    half_day:
        "bg-[var(--warning)]/10 text-[var(--warning)]",

    absent:
        "bg-[var(--danger)]/10 text-[var(--danger)]",

    on_leave:
        "bg-[var(--primary)]/10 text-[var(--primary)]",

    holiday:
        "bg-[var(--bg-hover)] text-[var(--text-secondary)]",
};


const AttendanceTable = ({
    history,
    loading,
    page,
    onPageChange,
}) => {

    const records =
        history?.records || [];

    const pagination =
        history?.pagination;


    const totalPages =
        pagination?.totalPages || 1;


    if (loading) {

        return (
            <div
                className="
                    rounded-2xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-surface)]
                    p-6
                "
            >

                <div
                    className="
                        h-7
                        w-48
                        animate-pulse
                        rounded
                        bg-[var(--bg-card)]
                    "
                />

                <div
                    className="
                        mt-6
                        space-y-3
                    "
                >

                    {Array.from({
                        length: 6,
                    }).map((_, index) => (

                        <div
                            key={`attendance-row-skeleton-${index}`}
                            className="
                                h-14
                                animate-pulse
                                rounded-xl
                                bg-[var(--bg-card)]
                            "
                        />

                    ))}

                </div>

            </div>
        );
    }


    return (

        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-surface)]
                shadow-[var(--shadow-md)]
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-[var(--border-color)]
                    px-6
                    py-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
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
                        Attendance History
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        Your recent attendance records
                    </p>

                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-[var(--text-muted)]
                    "
                >
                    <CalendarDays
                        size={17}
                    />

                    {pagination?.total || 0} records
                </div>

            </div>


            {/* DESKTOP TABLE */}

            <div
                className="
                    hidden
                    overflow-x-auto
                    lg:block
                "
            >

                <table
                    className="
                        w-full
                        text-left
                    "
                >

                    <thead>

                        <tr
                            className="
                                border-b
                                border-[var(--border-color)]
                                bg-[var(--bg-hover)]
                            "
                        >

                            {[
                                "DATE",
                                "CHECK IN",
                                "CHECK OUT",
                                "BREAK",
                                "TOTAL HOURS",
                                "MODE",
                                "STATUS",
                            ].map((heading) => (

                                <th
                                    key={heading}
                                    className="
                                        px-6
                                        py-4
                                        text-xs
                                        font-bold
                                        tracking-wide
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {heading}
                                </th>

                            ))}

                        </tr>

                    </thead>


                    <tbody>

                        {records.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="
                                        px-6
                                        py-14
                                        text-center
                                    "
                                >

                                    <Clock
                                        size={32}
                                        className="
                                            mx-auto
                                            text-[var(--text-muted)]
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-base
                                            font-medium
                                            text-[var(--text-secondary)]
                                        "
                                    >
                                        No attendance records
                                    </p>

                                </td>

                            </tr>

                        ) : (

                            records.map((record) => (

                                <tr
                                    key={record._id}
                                    className="
                                        border-b
                                        border-[var(--border-color)]
                                        last:border-0
                                        hover:bg-[var(--bg-hover)]
                                    "
                                >

                                    <td
                                        className="
                                            px-6
                                            py-4
                                            text-sm
                                            font-semibold
                                            text-[var(--text-primary)]
                                        "
                                    >
                                        {new Date(
                                            record.date
                                        ).toLocaleDateString(
                                            undefined,
                                            {
                                                day:
                                                    "2-digit",
                                                month:
                                                    "short",
                                                year:
                                                    "numeric",
                                            }
                                        )}
                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-[var(--text-secondary)]
                                        "
                                    >
                                        {record.checkInTime ||
                                            "--"}
                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-[var(--text-secondary)]
                                        "
                                    >
                                        {record.checkOutTime ||
                                            "--"}
                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-[var(--text-secondary)]
                                        "
                                    >
                                        {record.breakMinutes ??
                                            0}{" "}
                                        min
                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                            text-sm
                                            font-semibold
                                            text-[var(--text-primary)]
                                        "
                                    >
                                        {record.totalHours ??
                                            0}
                                        h
                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >

                                        <span
                                            className="
                                                rounded-lg
                                                bg-[var(--bg-hover)]
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-semibold
                                                capitalize
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            {record.mode}
                                        </span>

                                    </td>


                                    <td
                                        className="
                                            px-6
                                            py-4
                                        "
                                    >

                                        <span
                                            className={`
                                                rounded-lg
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                capitalize
                                                ${
                                                    statusClasses[
                                                        record.status
                                                    ] ||
                                                    statusClasses.present
                                                }
                                            `}
                                        >
                                            {record.status?.replaceAll(
                                                "_",
                                                " "
                                            )}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* MOBILE */}

            <div
                className="
                    divide-y
                    divide-[var(--border-color)]
                    lg:hidden
                "
            >

                {records.map((record) => (

                    <div
                        key={record._id}
                        className="
                            p-5
                        "
                    >

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-base
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {new Date(
                                        record.date
                                    ).toLocaleDateString(
                                        undefined,
                                        {
                                            day:
                                                "2-digit",
                                            month:
                                                "short",
                                            year:
                                                "numeric",
                                        }
                                    )}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {record.mode}
                                </p>

                            </div>


                            <span
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-bold
                                    capitalize
                                    ${
                                        statusClasses[
                                            record.status
                                        ] ||
                                        statusClasses.present
                                    }
                                `}
                            >
                                {record.status?.replaceAll(
                                    "_",
                                    " "
                                )}
                            </span>

                        </div>


                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Check In
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {record.checkInTime ||
                                        "--"}
                                </p>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Check Out
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {record.checkOutTime ||
                                        "--"}
                                </p>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Break
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {record.breakMinutes ??
                                        0}{" "}
                                    min
                                </p>

                            </div>


                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Total
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {record.totalHours ??
                                        0}
                                    h
                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>


            {/* PAGINATION */}

            {totalPages > 1 && (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[var(--border-color)]
                        px-6
                        py-4
                    "
                >

                    <p
                        className="
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        Page {page} of {totalPages}
                    </p>


                    <div
                        className="
                            flex
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                onPageChange(
                                    page - 1
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Previous
                        </button>


                        <button
                            type="button"
                            disabled={
                                page >=
                                totalPages
                            }
                            onClick={() =>
                                onPageChange(
                                    page + 1
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </section>
    );
};


export default AttendanceTable;