import {
    useEffect,
    useState,
} from "react";

import { X } from "lucide-react";


const EditTaskModal = ({
    task,
    open,
    onClose,
    onSubmit,
    loading,
}) => {

    const [form, setForm] =
        useState({
            title: "",
            description: "",
            priority: "medium",
            dueDate: "",
            department: "engineering",
        });


    useEffect(() => {

        if (!task) {
            return;
        }


        setForm({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            dueDate: task.dueDate
                ? task.dueDate.slice(0, 10)
                : "",
            department:
                task.department || "engineering",
        });

    }, [task]);


    if (!open || !task) {
        return null;
    }


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


    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!form.title.trim()) {
            return;
        }


        await onSubmit({
            title: form.title.trim(),
            description: form.description,
            priority: form.priority,
            dueDate: form.dueDate || undefined,
            department: form.department,
        });
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
                bg-black/50
                p-4
            "
        >

            <form
                onSubmit={handleSubmit}
                className="
                    w-full
                    max-w-2xl
                    rounded-2xl
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
                            Edit Task
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            Update the task details.
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


                <div className="space-y-5 p-6">

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
                                text-[var(--text-secondary)]
                            "
                        >
                            Task Title
                        </label>

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
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
                                text-xs
                                font-bold
                                uppercase
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
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                            "
                        />

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        "
                    >

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-bold
                                    uppercase
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
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--text-primary)]
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


                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-bold
                                    uppercase
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
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--text-primary)]
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

                                <option value="operations">
                                    Operations
                                </option>

                                <option value="research">
                                    Research
                                </option>

                            </select>

                        </div>

                    </div>


                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-bold
                                uppercase
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
                                w-full
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--text-primary)]
                            "
                        />

                    </div>

                </div>


                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        border-[var(--border-color)]
                        px-6
                        py-4
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-[var(--text-secondary)]
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-[var(--primary)]
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
};


export default EditTaskModal;