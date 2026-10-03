import React, {
    useEffect,
    useState,
} from "react";

import {
    Clock,
    LogIn,
    LogOut,
    Coffee,
    Play,
    Square,
    Building2,
    Home,
    CalendarOff,
} from "lucide-react";


const formatTime = (value) => {

    if (!value) {
        return "--";
    }

    return new Date(value).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );
};


const formatMinutes = (minutes = 0) => {

    const safeMinutes = Math.max(
        0,
        Number(minutes) || 0
    );

    const hours = Math.floor(
        safeMinutes / 60
    );

    const mins = safeMinutes % 60;

    return `${hours}h ${String(mins).padStart(2, "0")}m`;
};


const TodayAttendance = ({
    today,

    checkingIn,
    checkingOut,
    startingBreak,
    endingBreak,

    onCheckIn,
    onCheckOut,
    onStartBreak,
    onEndBreak,
}) => {

    const [mode, setMode] =
        useState(today?.mode || "office");

    const [
        elapsedSeconds,
        setElapsedSeconds,
    ] = useState(0);


    useEffect(() => {

        if (!today?.checkIn) {
            setElapsedSeconds(0);
            return;
        }

        const update = () => {

            if (
                today.state ===
                "checked_out"
            ) {
                setElapsedSeconds(
                    (today.totalWorkedMinutes || 0) *
                    60
                );

                return;
            }

            if (
                today.state ===
                "on_break"
            ) {
                setElapsedSeconds(
                    (today.totalWorkedMinutes || 0) *
                    60
                );

                return;
            }

            const start =
                new Date(
                    today.checkIn
                ).getTime();

            const now =
                Date.now();

            const seconds =
                Math.max(
                    0,
                    Math.floor(
                        (now - start) / 1000
                    )
                );

            const breakSeconds =
                (today.totalBreakMinutes || 0) *
                60;

            setElapsedSeconds(
                Math.max(
                    0,
                    seconds - breakSeconds
                )
            );
        };


        update();

        const timer =
            setInterval(
                update,
                1000
            );

        return () =>
            clearInterval(timer);

    }, [
        today?.checkIn,
        today?.checkOut,
        today?.state,
        today?.totalBreakMinutes,
        today?.totalWorkedMinutes,
    ]);


    const handleCheckIn = async () => {

        await onCheckIn(mode);
    };


    const isBusy =
        checkingIn ||
        checkingOut ||
        startingBreak ||
        endingBreak;


    const disabledByLeave =
        today?.onLeave;


    const disabledByHoliday =
        Boolean(today?.holiday);


    const canCheckIn =
        today?.state ===
            "not_checked_in" &&
        !disabledByLeave &&
        !disabledByHoliday;


    const canTakeBreak =
        today?.state ===
        "checked_in";


    const canEndBreak =
        today?.state ===
        "on_break";


    const canCheckOut =
        today?.state ===
        "checked_in";


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
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                {/* LEFT */}

                <div>

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
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-[var(--bg-hover)]
                                text-[var(--primary)]
                            "
                        >
                            <Clock size={24} />
                        </div>


                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-[var(--text-primary)]
                                "
                            >
                                Today's Attendance
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--text-muted)]
                                "
                            >
                                {today?.date
                                    ? new Date(
                                        today.date
                                    ).toLocaleDateString(
                                        undefined,
                                        {
                                            weekday:
                                                "long",
                                            month:
                                                "long",
                                            day:
                                                "numeric",
                                        }
                                    )
                                    : "Today"}
                            </p>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            items-center
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-[var(--text-muted)]
                                "
                            >
                                Status
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-base
                                    font-semibold
                                    capitalize
                                    text-[var(--text-primary)]
                                "
                            >
                                {today?.state
                                    ?.replaceAll(
                                        "_",
                                        " "
                                    ) ||
                                    "Not checked in"}
                            </p>

                        </div>


                        {today?.checkIn && (

                            <div>

                                <p
                                    className="
                                        text-sm
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Checked in
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-base
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {formatTime(
                                        today.checkIn
                                    )}
                                </p>

                            </div>

                        )}


                        {today?.checkOut && (

                            <div>

                                <p
                                    className="
                                        text-sm
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Checked out
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-base
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {formatTime(
                                        today.checkOut
                                    )}
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* RIGHT */}

                <div
                    className="
                        w-full
                        lg:max-w-sm
                    "
                >

                    {/* WORK MODE */}

                    {canCheckIn && (

                        <div>

                            <p
                                className="
                                    mb-2
                                    text-sm
                                    font-medium
                                    text-[var(--text-secondary)]
                                "
                            >
                                Work mode
                            </p>


                            <div
                                className="
                                    mb-4
                                    grid
                                    grid-cols-2
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMode(
                                            "office"
                                        )
                                    }
                                    className={`
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition
                                        ${
                                            mode ===
                                            "office"
                                                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                                        }
                                    `}
                                >
                                    <Building2
                                        size={17}
                                    />

                                    Office
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setMode(
                                            "remote"
                                        )
                                    }
                                    className={`
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition
                                        ${
                                            mode ===
                                            "remote"
                                                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                                : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                                        }
                                    `}
                                >
                                    <Home
                                        size={17}
                                    />

                                    Remote
                                </button>

                            </div>

                        </div>
                    )}


                    {/* NOTICE */}

                    {disabledByLeave && (

                        <div
                            className="
                                mb-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-hover)]
                                p-4
                            "
                        >

                            <CalendarOff
                                size={20}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-[var(--warning)]
                                "
                            />

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    You are on leave
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[var(--text-muted)]
                                    "
                                >
                                    Clock in is disabled
                                    for today.
                                </p>

                            </div>

                        </div>
                    )}


                    {disabledByHoliday && (

                        <div
                            className="
                                mb-4
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-hover)]
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-[var(--text-primary)]
                                "
                            >
                                {today.holiday.name ||
                                    "Company Holiday"}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--text-muted)]
                                "
                            >
                                Clock in is disabled
                                today.
                            </p>

                        </div>
                    )}


                    {/* ACTIONS */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                            lg:flex-col
                        "
                    >

                        {canCheckIn && (

                            <button
                                type="button"
                                disabled={isBusy}
                                onClick={
                                    handleCheckIn
                                }
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--primary)]
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    transition
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <LogIn
                                    size={18}
                                />

                                {checkingIn
                                    ? "Clocking In..."
                                    : "Clock In"}
                            </button>

                        )}


                        {canTakeBreak && (

                            <button
                                type="button"
                                disabled={isBusy}
                                onClick={
                                    onStartBreak
                                }
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--border-color)]
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-[var(--text-primary)]
                                    transition
                                    hover:bg-[var(--bg-hover)]
                                    disabled:opacity-50
                                "
                            >

                                <Coffee
                                    size={18}
                                />

                                {startingBreak
                                    ? "Starting..."
                                    : "Take Break"}

                            </button>

                        )}


                        {canEndBreak && (

                            <button
                                type="button"
                                disabled={isBusy}
                                onClick={
                                    onEndBreak
                                }
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--warning)]
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    disabled:opacity-50
                                "
                            >

                                <Play
                                    size={18}
                                />

                                {endingBreak
                                    ? "Ending..."
                                    : "End Break"}

                            </button>

                        )}


                        {canCheckOut && (

                            <button
                                type="button"
                                disabled={isBusy}
                                onClick={
                                    onCheckOut
                                }
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--danger)]
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-[var(--danger)]
                                    transition
                                    hover:bg-[var(--danger)]
                                    hover:text-white
                                    disabled:opacity-50
                                "
                            >

                                <LogOut
                                    size={18}
                                />

                                {checkingOut
                                    ? "Clocking Out..."
                                    : "Clock Out"}

                            </button>

                        )}

                    </div>


                    {/* WORKED TIME */}

                    <div
                        className="
                            mt-5
                            rounded-xl
                            bg-[var(--bg-hover)]
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-[var(--text-muted)]
                                "
                            >
                                Worked today
                            </span>

                            <span
                                className="
                                    text-base
                                    font-bold
                                    text-[var(--text-primary)]
                                "
                            >
                                {formatMinutes(
                                    Math.floor(
                                        elapsedSeconds /
                                        60
                                    )
                                )}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


export default TodayAttendance;