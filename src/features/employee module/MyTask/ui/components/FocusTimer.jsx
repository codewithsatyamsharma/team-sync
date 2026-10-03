import {
    useEffect,
    useState,
} from "react";

import {
    Play,
    RotateCcw,
    Timer,
} from "lucide-react";


const FocusTimer = () => {

    const DEFAULT_TIME = 25 * 60;

    const [seconds, setSeconds] =
        useState(DEFAULT_TIME);

    const [running, setRunning] =
        useState(false);


    useEffect(() => {

        if (!running) {
            return;
        }

        const timer =
            setInterval(() => {

                setSeconds((previous) => {

                    if (previous <= 1) {

                        setRunning(false);

                        return 0;
                    }

                    return previous - 1;
                });

            }, 1000);


        return () => clearInterval(timer);

    }, [running]);


    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

    const remainingSeconds =
        (seconds % 60)
            .toString()
            .padStart(2, "0");


    const reset = () => {

        setRunning(false);

        setSeconds(DEFAULT_TIME);
    };


    return (

        <div
            className="
                rounded-xl
                bg-[var(--primary)]
                p-5
                text-white
                shadow-lg
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <Timer size={18} />

                <h3 className="text-sm font-bold">
                    Deep Focus Timer
                </h3>

            </div>


            <div
                className="
                    mt-5
                    text-3xl
                    font-bold
                    tracking-wide
                "
            >
                {minutes}:{remainingSeconds}
            </div>


            <p
                className="
                    mt-2
                    text-xs
                    opacity-80
                "
            >
                Current Target: My Tasks
            </p>


            <div
                className="
                    mt-5
                    flex
                    gap-2
                "
            >

                <button
                    type="button"
                    onClick={() =>
                        setRunning((value) => !value)
                    }
                    className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-[var(--primary)]
                        transition
                        hover:opacity-90
                    "
                >

                    <Play size={13} />

                    {running
                        ? "Pause"
                        : "Start Focus"}

                </button>


                <button
                    type="button"
                    onClick={reset}
                    className="
                        rounded-lg
                        border
                        border-white/30
                        px-3
                        py-2
                        text-xs
                        font-medium
                        hover:bg-white/10
                    "
                >

                    <RotateCcw size={14} />

                </button>

            </div>

        </div>
    );
};


export default FocusTimer;