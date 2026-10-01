import React, {
    useMemo,
    useState,
} from "react";

import {
    Search,
    Plus,
    RefreshCw,
} from "lucide-react";

import { useTask } from "../../hooks/useTask.jsx";

import TaskColumn from "../components/TaskColumn.jsx";
import TaskModal from "../components/TaskModal.jsx";


const Tasks = () => {

    const {
        data: tasks,
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


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        modalOpen,
        setModalOpen,
    ] = useState(false);


    const [
        editingTask,
        setEditingTask,
    ] = useState(null);


    // =========================================
    // SEARCH
    // =========================================

    const filteredTasks = useMemo(() => {

        if (!search.trim()) {
            return tasks;
        }

        const query =
            search.toLowerCase().trim();


        return tasks.filter((task) => {

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

                task.priority
                    ?.toLowerCase()
                    .includes(query)
            );

        });

    }, [tasks, search]);


    // =========================================
    // COLUMNS
    // =========================================

    const todoTasks = useMemo(
        () =>
            filteredTasks.filter(
                (task) =>
                    task.status === "todo" ||
                    task.status === "pending"
            ),
        [filteredTasks]
    );


    const inProgressTasks = useMemo(
        () =>
            filteredTasks.filter(
                (task) =>
                    task.status ===
                    "in-progress"
            ),
        [filteredTasks]
    );


    const doneTasks = useMemo(
        () =>
            filteredTasks.filter(
                (task) =>
                    task.status === "done" ||
                    task.status === "completed"
            ),
        [filteredTasks]
    );


    // =========================================
    // OPEN CREATE MODAL
    // =========================================

    const handleCreateClick = () => {

        setEditingTask(null);

        setModalOpen(true);

    };


    // =========================================
    // OPEN EDIT MODAL
    // =========================================

    const handleEdit = (task) => {

        setEditingTask(task);

        setModalOpen(true);

    };


    // =========================================
    // CLOSE MODAL
    // =========================================

    const handleCloseModal = () => {

        setModalOpen(false);

        setEditingTask(null);

    };


    // =========================================
    // SUBMIT MODAL
    // =========================================

    const handleSubmit = async (
        taskData
    ) => {

        try {

            if (editingTask) {

                await updateExistingTask(
                    editingTask._id,
                    taskData
                );

            } else {

                await createNewTask(
                    taskData
                );

            }

            handleCloseModal();

        } catch (error) {

            console.error(
                "Failed to save task:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save task."
            );

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <main
                className="
                    min-h-full
                    w-full
                    bg-[var(--bg-main)]
                    p-8
                "
            >

                <div
                    className="
                        flex
                        h-[60vh]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >

                        <RefreshCw
                            size={18}
                            className="animate-spin"
                        />

                        Loading tasks...

                    </div>

                </div>

            </main>
        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (
            <main
                className="
                    min-h-full
                    w-full
                    bg-[var(--bg-main)]
                    p-8
                "
            >

                <div
                    className="
                        flex
                        min-h-[60vh]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-xl
                            border
                            border-[var(--border-color)]
                            bg-[var(--bg-surface)]
                            p-7
                            text-center
                        "
                    >

                        <h2
                            className="
                                text-lg
                                font-semibold
                                text-[var(--text-primary)]
                            "
                        >
                            Failed to load tasks
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-5
                                text-[var(--danger)]
                            "
                        >
                            {error.response?.data?.message ||
                                error.message ||
                                "Something went wrong."}
                        </p>


                        <button
                            type="button"
                            onClick={refetch}
                            className="
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-[var(--primary)]
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                            "
                        >

                            <RefreshCw size={15} />

                            Try Again

                        </button>

                    </div>

                </div>

            </main>
        );

    }


    // =========================================
    // MAIN UI
    // =========================================

    return (
        <main
            className="
                min-h-full
                w-full
                bg-[var(--bg-main)]
                px-6
                py-7
                lg:px-8
                xl:px-10
            "
        >

            {/* =================================
                HEADER
            ================================= */}

            <header
                className="
                    mb-8
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                    "
                >

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[var(--text-primary)]
                        "
                    >
                        Tasks
                    </h1>


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
                            type="text"
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
                                placeholder:text-[var(--text-muted)]
                                focus:border-[var(--primary)]
                                sm:w-64
                            "
                        />

                    </div>

                </div>


                {/* CREATE */}

                <button
                    type="button"
                    onClick={handleCreateClick}
                    className="
                        inline-flex
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
                        transition
                        hover:opacity-90
                    "
                >

                    <Plus size={17} />

                    Create Task

                </button>

            </header>


            {/* =================================
                KANBAN
            ================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-7
                    xl:grid-cols-3
                "
            >

                {/* TODO */}

                <TaskColumn
                    title="Todo"
                    tasks={todoTasks}
                    onEdit={handleEdit}
                    onDelete={deleteExistingTask}
                />


                {/* IN PROGRESS */}

                <TaskColumn
                    title="In Progress"
                    tasks={inProgressTasks}
                    onEdit={handleEdit}
                    onDelete={deleteExistingTask}
                />


                {/* DONE */}

                <TaskColumn
                    title="Done"
                    tasks={doneTasks}
                    onEdit={handleEdit}
                    onDelete={deleteExistingTask}
                />

            </div>


            {/* =================================
                EMPTY SEARCH
            ================================= */}

            {tasks.length > 0 &&
                filteredTasks.length === 0 && (

                    <div
                        className="
                            mt-12
                            text-center
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            No tasks match "{search}"
                        </p>

                    </div>

                )}


            {/* =================================
                MODAL
            ================================= */}

            <TaskModal
                open={modalOpen}
                task={editingTask}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                loading={
                    creating ||
                    updating ||
                    deleting
                }
            />

        </main>
    );
};


export default Tasks;