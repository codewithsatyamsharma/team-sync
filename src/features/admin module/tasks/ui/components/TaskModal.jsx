import React, {
    useEffect,
    useState,
} from "react";


const initialForm = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    department: "engineering",
    assigneeIds: [],
};


const TaskModal = ({
    open,
    task,
    onClose,
    onSubmit,
    loading,
}) => {

    const [form, setForm] =
        useState(initialForm);


    // =================================
    // LOAD EDIT DATA
    // =================================

    useEffect(() => {

        if (task) {

            setForm({
                title: task.title || "",
                description:
                    task.description || "",
                priority:
                    task.priority || "medium",
                dueDate: task.dueDate
                    ? task.dueDate.slice(0, 10)
                    : "",
                department:
                    task.department ||
                    "engineering",
                assigneeIds:
                    task.assigneeIds || [],
            });

        } else {

            setForm(initialForm);

        }

    }, [task, open]);


    if (!open) {
        return null;
    }


    // =================================
    // INPUT CHANGE
    // =================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =================================
    // SUBMIT
    // =================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!form.title.trim()) {

            return;

        }


        const payload = {

            title: form.title.trim(),

            description:
                form.description.trim(),

            priority:
                form.priority,

            dueDate:
                form.dueDate || undefined,

            department:
                form.department,

            assigneeIds:
                form.assigneeIds,

        };


        await onSubmit(payload);

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
                bg-black/40
                p-4
                backdrop-blur-sm
            "
        >

            <div
                className="
                    w-full
                    max-w-xl
                    overflow-hidden
                    rounded-xl
                    border
                    border-[var(--border-color)]
                    bg-[var(--bg-surface)]
                    shadow-2xl
                "
            >

                {/* HEADER */}

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
                                text-lg
                                font-semibold
                                text-[var(--text-primary)]
                            "
                        >
                            {task
                                ? "Edit Task"
                                : "Create New Task"}
                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            {task
                                ? "Update the task details."
                                : "Create a new task for your team."}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-md
                            text-lg
                            text-[var(--text-muted)]
                            hover:bg-[var(--bg-hover)]
                        "
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {/* TITLE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            Task Title
                        </label>


                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. System Security Patching"
                            required
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-3
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                placeholder:text-[var(--text-muted)]
                                focus:border-[var(--primary)]
                            "
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            Description
                        </label>


                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the task goals and requirements..."
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                p-3
                                text-sm
                                leading-5
                                text-[var(--text-primary)]
                                outline-none
                                placeholder:text-[var(--text-muted)]
                                focus:border-[var(--primary)]
                            "
                        />

                    </div>


                    {/* GRID */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        {/* PRIORITY */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                Priority
                            </label>


                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-3
                                    text-sm
                                    capitalize
                                    text-[var(--text-primary)]
                                    outline-none
                                "
                            >

                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                            </select>

                        </div>


                        {/* DEPARTMENT */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                Department
                            </label>


                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-3
                                    text-sm
                                    capitalize
                                    text-[var(--text-primary)]
                                    outline-none
                                "
                            >

                                <option value="engineering">
                                    Engineering
                                </option>

                                <option value="design">
                                    Design
                                </option>

                                <option value="marketing">
                                    Marketing
                                </option>

                                <option value="research">
                                    Research
                                </option>

                                <option value="operations">
                                    Operations
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                Due Date
                            </label>


                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-3
                                    text-sm
                                    text-[var(--text-primary)]
                                    outline-none
                                "
                            />

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            border-t
                            border-[var(--border-color)]
                            pt-5
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                px-4
                                py-2.5
                                text-sm
                                font-medium
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
                                !form.title.trim()
                            }
                            className="
                                rounded-lg
                                bg-[var(--primary)]
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : task
                                    ? "Save Changes"
                                    : "Create Task"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default TaskModal;