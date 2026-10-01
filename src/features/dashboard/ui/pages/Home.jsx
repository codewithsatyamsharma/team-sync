import { useDashboard } from "../../hooks/useDashboard.jsx";

import StatCard from "../components/dashboard/StatCard.jsx";
import TaskProgress from "../components/dashboard/TaskProgress.jsx";
import ActivityTimeline from "../components/dashboard/ActivityTimeline.jsx";
import ActiveTeamMembers from "../components/dashboard/ActiveTeamMembers.jsx";
import AISuggestion from "../components/dashboard/AISuggestion.jsx";
import { DashboardSkeleton } from "./DashboardSkeleton.jsx";

import {
  ClipboardList,
  CheckCircle2,
  Rocket,
  Users,
} from "lucide-react";

const Home = () => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <main
        className="
          min-h-full
          w-full
          bg-[var(--bg-main)]
          px-6
          py-6
        "
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-[var(--danger)]">
              Failed to load dashboard.
            </p>

            <button
              onClick={refetch}
              className="
                mt-4
                rounded-md
                bg-[var(--accent)]
                px-4
                py-2
                text-sm
                font-medium
                text-white
              "
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    {
      title: "Total Tasks",
      value: data.stats?.totalTasks?.value ?? 0,
      change: data.stats?.totalTasks?.change,
      icon: ClipboardList,
    },
    {
      title: "Completed Tasks",
      value: data.stats?.completedTasks?.value ?? 0,
      change: data.stats?.completedTasks?.change,
      icon: CheckCircle2,
    },
    {
      title: "Active Projects",
      value: data.stats?.activeProjects?.value ?? 0,
      changeLabel: "ACTIVE",
      icon: Rocket,
    },
    {
      title: "Team Members",
      value: data.stats?.teamMembers?.value ?? 0,
      changeLabel: "NEW",
      change: data.stats?.teamMembers?.newThisMonth,
      icon: Users,
    },
  ];

  return (
    <main
      className="
        min-h-full
        w-full
        bg-[var(--bg-main)]
        px-6
        py-6
        text-[var(--text-primary)]
        transition-colors
        duration-300
      "
    >
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full">

        {/* HEADER */}

        <section className="mb-6">
          <h1
            className="
              text-[24px]
              font-semibold
              tracking-tight
              text-[var(--text-primary)]
            "
          >
            Good morning, {data.user?.name || "User"} 👋
          </h1>

          <p
            className="
              mt-1
              text-[13px]
              text-[var(--text-muted)]
            "
          >
            Here's what's happening in Synthetix AI today.
          </p>
        </section>


        {/* STATS */}

        <section
          className="
            grid
            w-full
            grid-cols-2
            gap-4
            lg:grid-cols-4
          "
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
            />
          ))}
        </section>


        {/* MAIN DASHBOARD */}

        <section
          className="
            mt-5
            grid
            w-full
            grid-cols-1
            gap-5
            lg:grid-cols-[minmax(0,2.2fr)_minmax(320px,0.8fr)]
          "
        >

          {/* LEFT */}

          <div className="flex min-w-0 flex-col gap-5">

            <TaskProgress
              chart={data.chart}
            />

            <ActiveTeamMembers
              team={data.team}
            />

          </div>


          {/* RIGHT */}

          <div className="flex min-w-0 flex-col gap-5">

            <ActivityTimeline
              activities={data.activities}
            />

            <AISuggestion
              suggestion={data.suggestion}
            />

          </div>

        </section>

      </div>
    </main>
  );
};

export default Home;