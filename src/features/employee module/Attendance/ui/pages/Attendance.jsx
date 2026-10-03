import React, {
    useMemo,
    useState,
} from "react";

import {
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import {
    useAttendance,
} from "../../hooks/useAttendance.jsx";

import AttendanceSummary
    from "../components/AttendanceSummary.jsx";

import TodayAttendance
    from "../components/TodayAttendance.jsx";

import AttendanceTable
    from "../components/AttendanceTable.jsx";

import AttendanceCalendar
    from "../components/AttendanceCalendar.jsx";

import LeaveSection
    from "../components/LeaveSection.jsx";


const getCurrentMonth = () => {

    const date = new Date();

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;
};


const Attendance = () => {

    const [
        month,
        setMonth,
    ] = useState(
        getCurrentMonth()
    );


    const [
        page,
        setPage,
    ] = useState(1);


    const {
        today,

        todayLoading,
        todayError,

        history,
        historyLoading,

        summary,
        summaryLoading,

        calendar,
        calendarLoading,

        leaves,

        checkIn,
        checkingIn,

        checkOut,
        checkingOut,

        startBreak,
        startingBreak,

        endBreak,
        endingBreak,

        requestLeave,
        requestingLeave,
    } = useAttendance({
        month,
        page,
        limit: 6,
    });


    const error =
        todayError;


    /* =====================================================
       MONTH NAVIGATION
    ===================================================== */

    const changeMonth = (
        direction
    ) => {

        const current =
            new Date(
                `${month}-01T00:00:00`
            );

        current.setMonth(
            current.getMonth() +
            direction
        );

        const newMonth =
            `${current.getFullYear()}-${String(
                current.getMonth() + 1
            ).padStart(2, "0")}`;

        setMonth(newMonth);
        setPage(1);
    };


    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleCheckIn = async (
        mode
    ) => {

        try {

            await checkIn(mode);

        } catch (error) {

            console.error(
                "Check-in failed:",
                error
            );

        }
    };


    const handleCheckOut = async () => {

        try {

            await checkOut();

        } catch (error) {

            console.error(
                "Check-out failed:",
                error
            );

        }
    };


    const handleStartBreak = async () => {

        try {

            await startBreak();

        } catch (error) {

            console.error(
                "Start break failed:",
                error
            );

        }
    };


    const handleEndBreak = async () => {

        try {

            await endBreak();

        } catch (error) {

            console.error(
                "End break failed:",
                error
            );

        }
    };


    const handleRequestLeave = async (
        payload
    ) => {

        try {

            await requestLeave(
                payload
            );

        } catch (error) {

            console.error(
                "Leave request failed:",
                error
            );

            throw error;
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        todayLoading &&
        !today
    ) {

        return (

            <main
                className="
                    min-h-full
                    w-full
                    bg-[var(--bg-main)]
                    p-5
                    text-[var(--text-primary)]
                    sm:p-6
                    lg:p-8
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1600px]
                    "
                >

                    <div
                        className="
                            h-10
                            w-64
                            animate-pulse
                            rounded
                            bg-[var(--bg-card)]
                        "
                    />

                    <div
                        className="
                            mt-8
                            grid
                            gap-5
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        {Array.from({
                            length: 4,
                        }).map((_, index) => (

                            <div
                                key={`page-skeleton-${index}`}
                                className="
                                    h-32
                                    animate-pulse
                                    rounded-2xl
                                    bg-[var(--bg-card)]
                                "
                            />

                        ))}

                    </div>

                </div>

            </main>
        );
    }


    return (

        <main
            className="
                min-h-full
                w-full
                bg-[var(--bg-main)]
                text-[var(--text-primary)]
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    space-y-6
                    p-5
                    sm:p-6
                    lg:space-y-8
                    lg:p-8
                "
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <header
                    className="
                        flex
                        flex-col
                        gap-4
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >

                    <div>

                        <h1
                            className="
                                text-2xl
                                font-extrabold
                                tracking-tight
                                text-[var(--text-primary)]
                                sm:text-3xl
                            "
                        >
                            Attendance & Timesheet
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-[var(--text-muted)]
                                sm:text-base
                            "
                        >
                            Track your working hours,
                            attendance and time off.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <span
                            className="
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-surface)]
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                            "
                        >
                            {month}
                        </span>

                    </div>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-[var(--danger)]
                            bg-[var(--danger)]/10
                            p-4
                        "
                    >

                        <AlertCircle
                            size={20}
                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--danger)]
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
                                Failed to load attendance
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--text-secondary)]
                                "
                            >
                                {error?.response
                                    ?.data
                                    ?.message ||
                                    error?.message ||
                                    "Something went wrong."}
                            </p>

                        </div>

                    </div>
                )}


                {/* =================================================
                    TODAY
                ================================================= */}

                <TodayAttendance
                    today={today}
                    checkingIn={checkingIn}
                    checkingOut={checkingOut}
                    startingBreak={
                        startingBreak
                    }
                    endingBreak={
                        endingBreak
                    }
                    onCheckIn={
                        handleCheckIn
                    }
                    onCheckOut={
                        handleCheckOut
                    }
                    onStartBreak={
                        handleStartBreak
                    }
                    onEndBreak={
                        handleEndBreak
                    }
                />


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <AttendanceSummary
                    summary={summary}
                    loading={summaryLoading}
                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6
                        2xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]
                    "
                >

                    {/* HISTORY */}

                    <div className="min-w-0">

                        <AttendanceTable
                            history={history}
                            loading={
                                historyLoading
                            }
                            page={page}
                            onPageChange={
                                setPage
                            }
                        />

                    </div>


                    {/* CALENDAR */}

                    <div className="min-w-0">

                        <AttendanceCalendar
                            month={month}
                            calendar={
                                calendar
                            }
                            onPreviousMonth={() =>
                                changeMonth(-1)
                            }
                            onNextMonth={() =>
                                changeMonth(1)
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    LEAVE
                ================================================= */}

                <LeaveSection
                    leaves={leaves}
                    requestingLeave={
                        requestingLeave
                    }
                    onRequestLeave={
                        handleRequestLeave
                    }
                />

            </div>

        </main>
    );
};


export default Attendance;