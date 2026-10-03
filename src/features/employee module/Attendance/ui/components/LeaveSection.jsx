import React, {
    useState,
} from "react";

import {
    Plus,
    CalendarDays,
    Clock3,
} from "lucide-react";

import RequestLeaveModal
    from "./RequestLeaveModal.jsx";


const LeaveSection = ({
    leaves,
    requestingLeave,
    onRequestLeave,
}) => {

    const [
        modalOpen,
        setModalOpen,
    ] = useState(false);


    const leaveRecords =
        leaves?.leaves || [];


    const holidays =
        leaves?.upcomingHolidays || [];


    const pto =
        leaves?.pto || {};


    const handleSubmit = async (
        payload
    ) => {

        await onRequestLeave(
            payload
        );

        setModalOpen(false);
    };


    return (

        <>

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
                        flex-col
                        gap-4
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
                            Leave & Time Off
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            Manage your leave requests
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setModalOpen(true)
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--primary)]
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:opacity-90
                        "
                    >
                        <Plus size={18} />
                        Request Leave
                    </button>

                </div>


                {/* PTO */}

                <div
                    className="
                        mt-6
                        rounded-xl
                        bg-[var(--bg-hover)]
                        p-5
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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-[var(--text-muted)]
                                "
                            >
                                PTO Balance
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-[var(--text-primary)]
                                "
                            >
                                {pto.remaining ??
                                    0}{" "}
                                days
                            </p>

                        </div>


                        <div
                            className="
                                text-right
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-[var(--text-muted)]
                                "
                            >
                                Available
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-base
                                    font-bold
                                    text-[var(--success)]
                                "
                            >
                                {pto.available ??
                                    0}{" "}
                                days
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            mt-4
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-[var(--bg-main)]
                        "
                    >

                        <div
                            className="
                                h-full
                                rounded-full
                                bg-[var(--primary)]
                            "
                            style={{
                                width: `${
                                    pto.allowance
                                        ? Math.min(
                                            100,
                                            ((pto.used ||
                                                0) /
                                                pto.allowance) *
                                                100
                                        )
                                        : 0
                                }%`,
                            }}
                        />

                    </div>


                    <div
                        className="
                            mt-3
                            flex
                            justify-between
                            text-xs
                            text-[var(--text-muted)]
                        "
                    >

                        <span>
                            Used {pto.used ?? 0}
                        </span>

                        <span>
                            Pending {pto.pending ?? 0}
                        </span>

                        <span>
                            Allowance{" "}
                            {pto.allowance ?? 0}
                        </span>

                    </div>

                </div>


                {/* LEAVE REQUESTS */}

                {leaveRecords.length > 0 && (

                    <div className="mt-6">

                        <h3
                            className="
                                mb-3
                                text-base
                                font-bold
                                text-[var(--text-primary)]
                            "
                        >
                            My Leave Requests
                        </h3>


                        <div
                            className="
                                space-y-3
                            "
                        >

                            {leaveRecords.map(
                                (leave) => (

                                    <div
                                        key={
                                            leave._id
                                        }
                                        className="
                                            rounded-xl
                                            border
                                            border-[var(--border-color)]
                                            p-4
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-3
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-bold
                                                        capitalize
                                                        text-[var(--text-primary)]
                                                    "
                                                >
                                                    {leave.type?.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-[var(--text-muted)]
                                                    "
                                                >
                                                    {
                                                        leave.startDate
                                                    }

                                                    {" → "}

                                                    {
                                                        leave.endDate
                                                    }

                                                    {" · "}

                                                    {
                                                        leave.days
                                                    }{" "}
                                                    day
                                                    {leave.days !==
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </p>

                                            </div>


                                            <span
                                                className="
                                                    w-fit
                                                    rounded-lg
                                                    bg-[var(--bg-hover)]
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-bold
                                                    capitalize
                                                    text-[var(--text-secondary)]
                                                "
                                            >
                                                {
                                                    leave.status
                                                }
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>
                )}


                {/* HOLIDAYS */}

                {holidays.length > 0 && (

                    <div className="mt-6">

                        <h3
                            className="
                                mb-3
                                text-base
                                font-bold
                                text-[var(--text-primary)]
                            "
                        >
                            Upcoming Holidays
                        </h3>


                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            {holidays.map(
                                (holiday) => (

                                    <div
                                        key={`${holiday.date}-${holiday.name}`}
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            rounded-xl
                                            bg-[var(--bg-hover)]
                                            p-4
                                        "
                                    >

                                        <CalendarDays
                                            size={20}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-[var(--primary)]
                                            "
                                        />

                                        <div>

                                            <p
                                                className="
                                                    text-sm
                                                    font-bold
                                                    text-[var(--text-primary)]
                                                "
                                            >
                                                {
                                                    holiday.name
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-[var(--text-muted)]
                                                "
                                            >
                                                {
                                                    holiday.date
                                                }
                                            </p>

                                            {holiday.description && (

                                                <p
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-[var(--text-secondary)]
                                                    "
                                                >
                                                    {
                                                        holiday.description
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>
                )}

            </section>


            <RequestLeaveModal
                open={modalOpen}
                onClose={() =>
                    setModalOpen(false)
                }
                onSubmit={
                    handleSubmit
                }
                loading={
                    requestingLeave
                }
            />

        </>
    );
};


export default LeaveSection;