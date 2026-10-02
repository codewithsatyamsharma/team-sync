import {
    Activity,
    CheckCircle2,
    ClipboardList,
    LoaderCircle,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard.jsx";

import StatCard from "../components/StatCard.jsx";
import TaskProgress from "../components/TaskProgress.jsx";
import ActivityTimeline from "../components/ActivityTimeline.jsx";
import ActiveTeamMembers from "../components/ActiveTeamMembers.jsx";
import AISuggestion from "../components/AISuggestion.jsx";


const Home = () => {

    const {
        data,
        loading,
        error,
        refetch,
    } = useDashboard();


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
                    size={32}
                    className="
                        animate-spin
                        text-[var(--primary)]
                    "
                />

            </div>
        );

    }


    if (error) {

        return (
            <div
                className="
                    flex
                    min-h-[500px]
                    flex-col
                    items-center
                    justify-center
                    gap-4
                "
            >

                <p
                    className="
                        text-sm
                        text-[var(--danger)]
                    "
                >
                    Failed to load dashboard.
                </p>


                <button
                    onClick={refetch}
                    className="
                        rounded-lg
                        bg-[var(--primary)]
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
        );

    }


    if (!data) {
        return null;
    }


    const {
        user,
        stats,
        chart,
        activities,
        team,
        suggestion,
    } = data;


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

            <div className="mb-8">

                <h1
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-[var(--text-primary)]
                        md:text-3xl
                    "
                >
                    Good morning,{" "}
                    {user?.name || "User"} 👋
                </h1>


                <p
                    className="
                        mt-1
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    Here's what's happening in Synthetix AI today.
                </p>

            </div>


            {/* ================================= */}
            {/* STATS */}
            {/* ================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                <StatCard
                    type="totalTasks"
                    title="Total Tasks"
                    value={
                        stats?.totalTasks?.value ?? 0
                    }
                    change={
                        stats?.totalTasks?.change
                    }
                />


                <StatCard
                    type="completedTasks"
                    title="Completed Tasks"
                    value={
                        stats?.completedTasks?.value ?? 0
                    }
                    change={
                        stats?.completedTasks?.change
                    }
                />


                <StatCard
                    type="activeProjects"
                    title="Active Projects"
                    value={
                        stats?.activeProjects?.value ?? 0
                    }
                    extra="Active"
                />


                <StatCard
                    type="teamMembers"
                    title="Team Members"
                    value={
                        stats?.teamMembers?.value ?? 0
                    }
                    extra={
                        stats?.teamMembers?.newThisMonth
                            ? `New ${stats.teamMembers.newThisMonth}`
                            : undefined
                    }
                />

            </div>


            {/* ================================= */}
            {/* MAIN CONTENT */}
            {/* ================================= */}

            <div
                className="
                    mt-6
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
                "
            >

                {/* LEFT */}

                <div className="min-w-0">

                    <TaskProgress
                        chart={chart}
                    />


                    <div className="mt-6">

                        <ActiveTeamMembers
                            team={team}
                        />

                    </div>

                </div>


                {/* RIGHT */}

                <div className="min-w-0 space-y-6">

                    <ActivityTimeline
                        activities={activities}
                    />


                    <AISuggestion
                        suggestion={suggestion}
                    />

                </div>

            </div>

        </main>
    );
};


export default Home;