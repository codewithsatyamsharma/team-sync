import React, {
    useState,
} from "react";

import {
    X,
} from "lucide-react";


const RequestLeaveModal = ({
    open,
    onClose,
    onSubmit,
    loading,
}) => {

    const [
        type,
        setType,
    ] = useState("paid_time_off");


    const [
        startDate,
        setStartDate,
    ] = useState("");


    const [
        endDate,
        setEndDate,
    ] = useState("");


    const [
        handoverNote,
        setHandoverNote,
    ] = useState("");


    if (!open) {
        return null;
    }


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (
            !startDate ||
            !endDate
        ) {
            return;
        }

        await onSubmit({
            type,
            startDate,
            endDate,
            handoverNote,
        });

        setType(
            "paid_time_off"
        );

        setStartDate("");
        setEndDate("");
        setHandoverNote("");
    };


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/60
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-lg
                    rounded-2xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-surface)]
                    shadow-2xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[var(--border-color)]
                        px-6
                        py-5
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
                            Request Leave
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            Submit a new time-off request
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            text-[var(--text-muted)]
                            hover:bg-[var(--bg-hover)]
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-5
                        p-6
                    "
                >

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                            "
                        >
                            Leave Type
                        </label>

                        <select
                            value={type}
                            onChange={(event) =>
                                setType(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                            "
                        >

                            <option value="paid_time_off">
                                Paid Time Off
                            </option>

                            <option value="sick">
                                Sick Leave
                            </option>

                            <option value="casual">
                                Casual Leave
                            </option>

                            <option value="unpaid">
                                Unpaid Leave
                            </option>

                        </select>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-[var(--text-secondary)]
                                "
                            >
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={
                                    startDate
                                }
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            />

                        </div>


                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-[var(--text-secondary)]
                                "
                            >
                                End Date
                            </label>

                            <input
                                type="date"
                                value={
                                    endDate
                                }
                                min={
                                    startDate ||
                                    undefined
                                }
                                onChange={(event) =>
                                    setEndDate(
                                        event.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            />

                        </div>

                    </div>


                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                            "
                        >
                            Handover Note
                        </label>

                        <textarea
                            value={
                                handoverNote
                            }
                            onChange={(event) =>
                                setHandoverNote(
                                    event.target.value
                                )
                            }
                            rows={4}
                            placeholder="Optional handover details..."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                placeholder:text-[var(--text-muted)]
                                focus:border-[var(--primary)]
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                                hover:bg-[var(--bg-hover)]
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !startDate ||
                                !endDate
                            }
                            className="
                                rounded-xl
                                bg-[var(--primary)]
                                px-5
                                py-3
                                text-sm
                                font-bold
                                text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Request"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default RequestLeaveModal;