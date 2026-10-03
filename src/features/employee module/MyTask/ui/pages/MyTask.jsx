import {
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    List,
    RefreshCw,
    Search,
} from "lucide-react";

import { useSelector } from "react-redux";

import { useMyTask } from "../../hooks/useMyTask.jsx";

import TaskStats from "../components/TaskStats.jsx";
import MyTaskCard from "../components/MyTaskCard.jsx";
import FocusTimer from "../components/FocusTimer.jsx";
import Scratchpad from "../components/Scratchpad.jsx";
import SprintDistribution from "../components/SprintDistribution.jsx";


const MyTasks = () => {

    const employee = useSelector(
        (state) => state.auth.employee
    );


    const [search, setSearch] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [status, setStatus] =
        useState("");


    const {
        tasks,
        loading,
        fetching,
        error,
        refetch,
    } = useMyTask();


    /*
    |--------------------------------------------------------------------------
    | CLIENT-SIDE SEARCH/FILTER
    |--------------------------------------------------------------------------
    */

    const filteredTasks = useMemo(() => {

        let result = Array.isArray(tasks)
            ? tasks
            : [];


        if (search.trim()) {

            const value =
                search.toLowerCase();

            result = result.filter((task) =>

                String(task.title || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(task.description || "")
                    .toLowerCase()
                    .includes(value)

                ||

                String(task.department || "")
                    .toLowerCase()
                    .includes(value)

            );
        }


        if (priority) {

            result = result.filter(
                (task) =>
                    String(task.priority || "")
                        .toLowerCase() ===
                    priority.toLowerCase()
            );
        }


        if (status) {

            result = result.filter(
                (task) =>
                    String(task.status || "")
                        .toLowerCase() ===
                    status.toLowerCase()
            );
        }


        return result;

    }, [
        tasks,
        search,
        priority,
        status,
    ]);


    /*
    |--------------------------------------------------------------------------
    | SECTIONS
    |--------------------------------------------------------------------------
    */

    const urgentTasks =
        filteredTasks.filter((task) => {

            const due =
                task.dueDate
                    ? new Date(task.dueDate)
                    : null;

            const today =
                new Date();

            const isToday =
                due &&
                due.toDateString() ===
                    today.toDateString();

            const highPriority =
                String(task.priority)
                    .toLowerCase() === "high";

            return (
                isToday ||
                highPriority
            );

        });


    const inProgressTasks =
        filteredTasks.filter((task) => {

            const status =
                String(
                    task.status || ""
                ).toLowerCase();

            return (
                status === "in_progress" ||
                status === "in-progress"
            );

        });


    const completedTasks =
        filteredTasks.filter((task) => {

            const status =
                String(
                    task.status || ""
                ).toLowerCase();

            return (
                status === "completed" ||
                status === "done"
            );

        });


    const upcomingTasks =
        filteredTasks.filter((task) => {

            const status =
                String(
                    task.status || ""
                ).toLowerCase();

            return (
                status !== "completed" &&
                status !== "done" &&
                status !== "in_progress" &&
                status !== "in-progress"
            );

        });


    /*
    |--------------------------------------------------------------------------
    | TASK SECTION
    |--------------------------------------------------------------------------
    */

    const TaskSection = ({
        title,
        count,
        tasks: sectionTasks,
        dotClass,
    }) => (

        <section>

            <div
                className="
                    mb-3
                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span
                        className={`
                            h-2.5
                            w-2.5
                            rounded-full
                            ${dotClass}
                        `}
                    />

                    <h2
                        className="
                            text-base
                            font-bold
                            text-[var(--text-primary)]
                        "
                    >
                        {title}
                    </h2>

                    <span
                        className="
                            rounded-full
                            bg-[var(--bg-hover)]
                            px-2
                            py-0.5
                            text-xs
                            font-bold
                            text-[var(--text-muted)]
                        "
                    >
                        {count}
                    </span>

                </div>

                <span
                    className="
                        text-xs
                        text-[var(--text-muted)]
                    "
                >
                    Priority Queue
                </span>

            </div>


            {sectionTasks.length === 0 ? (

                <div
                    className="
                        rounded-xl
                        border
                        border-dashed
                        border-[var(--border-color)]
                        bg-[var(--bg-card)]
                        p-8
                        text-center
                    "
                >

                    <p
                        className="
                            text-sm
                            text-[var(--text-muted)]
                        "
                    >
                        No tasks in this section
                    </p>

                </div>

            ) : (

                <div className="space-y-3">

                    {sectionTasks.map((task) => (

                        <MyTaskCard
                            key={task._id || task.id}
                            task={task}
                        />

                    ))}

                </div>

            )}

        </section>
    );


    return (

        <main
            className="
                min-h-full
                bg-[var(--bg-main)]
                px-5
                py-6
                lg:px-8
                xl:px-10
            "
        >

            <div
                className="
                    mx-auto
                    max-w-[1500px]
                "
            >

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <header
                    className="
                        flex
                        flex-col
                        gap-5
                        xl:flex-row
                        xl:items-center
                        xl:justify-between
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
                            WORKSPACE • MY SPACE
                        </p>

                        <h1
                            className="
                                mt-1
                                text-3xl
                                font-bold
                                tracking-tight
                                text-[var(--text-primary)]
                            "
                        >
                            My Tasks
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-[var(--text-secondary)]
                            "
                        >
                            Track personal deliverables,
                            active sprint items, and
                            priorities assigned to you.
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="
                                flex
                                h-10
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                px-4
                                text-sm
                                font-semibold
                                text-[var(--text-secondary)]
                                hover:bg-[var(--bg-hover)]
                            "
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    fetching
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh

                        </button>

                    </div>

                </header>


                {/* =====================================================
                    STATS
                ====================================================== */}

                <div className="mt-7">

                    <TaskStats
                        tasks={tasks}
                    />

                </div>


                {/* =====================================================
                    FILTER BAR
                ====================================================== */}

                <div
                    className="
                        mt-7
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-[var(--border-color)]
                        bg-[var(--bg-card)]
                        p-3
                        lg:flex-row
                        lg:items-center
                    "
                >

                    <div
                        className="
                            relative
                            flex-1
                        "
                    >

                        <Search
                            size={18}
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
                            placeholder="Search tasks by name or keyword..."
                            className="
                                h-11
                                w-full
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                pl-10
                                pr-4
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                            "
                        />

                    </div>


                    <div className="relative">

                        <select
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
                                )
                            }
                            className="
                                h-11
                                min-w-[150px]
                                appearance-none
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                pr-10
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                            "
                        >

                            <option value="">
                                Priority: All
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="low">
                                Low
                            </option>

                        </select>

                        <ChevronDown
                            size={16}
                            className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                            "
                        />

                    </div>


                    <div className="relative">

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            className="
                                h-11
                                min-w-[150px]
                                appearance-none
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-4
                                pr-10
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                            "
                        >

                            <option value="">
                                Status: All
                            </option>

                            <option value="todo">
                                To Do
                            </option>

                            <option value="in_progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                        </select>

                        <ChevronDown
                            size={16}
                            className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                            "
                        />

                    </div>


                    <button
                        type="button"
                        className="
                            flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-[var(--border-color)]
                            px-4
                            text-sm
                            font-semibold
                            text-[var(--text-secondary)]
                        "
                    >

                        <List size={16} />

                        List

                    </button>

                </div>


                {/* =====================================================
                    CONTENT
                ====================================================== */}

                {loading ? (

                    <div
                        className="
                            mt-8
                            flex
                            min-h-[400px]
                            items-center
                            justify-center
                        "
                    >

                        <div
                            className="
                                text-sm
                                text-[var(--text-muted)]
                            "
                        >
                            Loading your tasks...
                        </div>

                    </div>

                ) : error ? (

                    <div
                        className="
                            mt-8
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-6
                            text-red-600
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <AlertCircle size={20} />

                            <div>

                                <p className="font-semibold">
                                    Failed to load your tasks
                                </p>

                                <p className="mt-1 text-sm">
                                    {error?.response?.data?.message ||
                                        error?.message ||
                                        "Something went wrong."}
                                </p>

                            </div>

                        </div>

                        <button
                            onClick={() => refetch()}
                            className="
                                mt-4
                                rounded-lg
                                bg-red-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Try Again
                        </button>

                    </div>

                ) : (

                    <div
                        className="
                            mt-8
                            grid
                            grid-cols-1
                            gap-7
                            xl:grid-cols-[minmax(0,1fr)_330px]
                        "
                    >

                        {/* LEFT */}

                        <div className="space-y-8">

                            <TaskSection
                                title="Urgent & Due Today"
                                count={urgentTasks.length}
                                tasks={urgentTasks}
                                dotClass="bg-red-500"
                            />


                            <TaskSection
                                title="In Progress"
                                count={inProgressTasks.length}
                                tasks={inProgressTasks}
                                dotClass="bg-blue-500"
                            />


                            <TaskSection
                                title="Upcoming & Backlog"
                                count={upcomingTasks.length}
                                tasks={upcomingTasks}
                                dotClass="bg-gray-400"
                            />


                            {completedTasks.length > 0 && (

                                <TaskSection
                                    title="Completed"
                                    count={completedTasks.length}
                                    tasks={completedTasks}
                                    dotClass="bg-green-500"
                                />

                            )}

                        </div>


                        {/* RIGHT SIDEBAR */}

                        <aside
                            className="
                                space-y-5
                            "
                        >

                            <FocusTimer />

                            <Scratchpad />

                            <SprintDistribution
                                tasks={tasks}
                            />

                        </aside>

                    </div>

                )}

            </div>

        </main>
    );
};


export default MyTasks;