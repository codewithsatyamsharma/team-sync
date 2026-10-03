import {
    useEffect,
    useState,
} from "react";


const Scratchpad = () => {

    const [notes, setNotes] =
        useState(() =>
            localStorage.getItem(
                "my-task-scratchpad"
            ) || ""
        );


    useEffect(() => {

        localStorage.setItem(
            "my-task-scratchpad",
            notes
        );

    }, [notes]);


    return (

        <div
            className="
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
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

                    <h3
                        className="
                            text-base
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        Personal Scratchpad
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-[var(--text-muted)]
                        "
                    >
                        Auto-saved
                    </p>

                </div>

            </div>


            <textarea
                value={notes}
                onChange={(event) =>
                    setNotes(event.target.value)
                }
                placeholder="Write a quick note..."
                rows={7}
                className="
                    mt-4
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-main)]
                    p-3
                    text-sm
                    leading-6
                    text-[var(--text-primary)]
                    outline-none
                    transition
                    focus:border-[var(--primary)]
                "
            />

        </div>
    );
};


export default Scratchpad;