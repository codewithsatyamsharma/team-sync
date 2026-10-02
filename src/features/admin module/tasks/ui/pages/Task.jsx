import {
    LoaderCircle,
    Plus,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import { useTask } from "../../hooks/useTask.jsx";

import TaskColumn from "../components/TaskColumn.jsx";
import TaskModal from "../components/TaskModal.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";


const Task = () => {

    const {
        data,
        loading,
        error,

        creating,
        updating,
        deleting,

        createNewTask,
        updateExistingTask,
        deleteExistingTask,

        refetch,
    } = useTask();


    const [search, setSearch] =
        useState("");

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [editingTask, setEditingTask] =
        useState(null);


    // ==========================================
    // FILTER
    // ==========================================

    const filteredTasks = useMemo(() => {

        const query =
            search.trim().toLowerCase();


        if (!query) {
            return data;
        }


        return data.filter((task) => {

            return (
                task.title
                    ?.toLowerCase()
                    .includes(query) ||

                task.description
                    ?.toLowerCase()
                    .includes(query) ||

                task.department
                    ?.toLowerCase()
                    .includes(query) ||

                task.projectName
                    ?.toLowerCase()
                    .includes(query)
            );

        });

    }, [data, search]);


    // ==========================================
    // COLUMNS
    // ==========================================

    const todoTasks =
        filteredTasks.filter(
            (task) => task.status === "todo"
        );


    const progressTasks =
        filteredTasks.filter(
            (task) =>
                task.status === "in-progress"
        );


    const doneTasks =
        filteredTasks.filter(
            (task) =>
                task.status === "done"
        );


    // ==========================================
    // CREATE
    // ==========================================

    const handleCreate = async (
        taskData
    ) => {

        try {

            await createNewTask(
                taskData
            );

            setShowCreateModal(false);

        } catch (err) {

            console.error(
                "Failed to create task:",
                err
            );

        }
    };


    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (task) => {

        setEditingTask(task);

    };


    // ==========================================
    // UPDATE
    // ==========================================

    const handleUpdate = async (
        taskData
    ) => {

        if (!editingTask?._id) {
            return;
        }


        try {

            await updateExistingTask(
                editingTask._id,
                taskData
            );

            setEditingTask(null);

        } catch (err) {

            console.error(
                "Failed to update task:",
                err
            );

        }

    };


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (
        task
    ) => {

        const confirmed =
            window.confirm(
                `Delete "${task.title}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteExistingTask(
                task._id
            );

        } catch (err) {

            console.error(
                "Failed to delete task:",
                err
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                "
            >

                <LoaderCircle
                    size={34}
                    className="
                        animate-spin
                        text-[var(--primary)]
                    "
                />

            </div>
        );

    }


    return (
        <main
            className="
                w-full
                min-w-0
                px-6
                py-6
                lg:px-8
                xl:px-10
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        Tasks
                    </h1>

                </div>


                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                    "
                >

                    {/* SEARCH */}

                    <div className="relative">

                        <Search
                            size={17}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-[var(--text-muted)]
                            "
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search tasks..."
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-surface)]
                                pl-10
                                pr-4
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                                sm:w-64
                            "
                        />

                    </div>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={refetch}
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[var(--border-color)]
                            px-3
                            text-[var(--text-secondary)]
                            hover:bg-[var(--bg-hover)]
                        "
                        title="Refresh"
                    >
                        <RefreshCw size={17} />
                    </button>


                    {/* CREATE */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowCreateModal(true)
                        }
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-[var(--primary)]
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                        "
                    >

                        <Plus size={17} />

                        Create Task

                    </button>

                </div>

            </div>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (

                <div
                    className="
                        mt-5
                        rounded-lg
                        border
                        border-red-300
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-600
                    "
                >
                    Failed to load tasks.
                </div>

            )}


            {/* ================================= */}
            {/* KANBAN */}
            {/* ================================= */}

            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-8
                    xl:grid-cols-3
                "
            >

                <TaskColumn
                    title="Todo"
                    tasks={todoTasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />


                <TaskColumn
                    title="In Progress"
                    tasks={progressTasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />


                <TaskColumn
                    title="Done"
                    tasks={doneTasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>


            {/* ================================= */}
            {/* CREATE MODAL */}
            {/* ================================= */}

            <TaskModal
                open={showCreateModal}
                onClose={() =>
                    setShowCreateModal(false)
                }
                onSubmit={handleCreate}
                loading={creating}
            />


            {/* ================================= */}
            {/* EDIT MODAL */}
            {/* ================================= */}

            <EditTaskModal
                task={editingTask}
                open={Boolean(editingTask)}
                onClose={() =>
                    setEditingTask(null)
                }
                onSubmit={handleUpdate}
                loading={updating}
            />

        </main>
    );
};


export default Task;