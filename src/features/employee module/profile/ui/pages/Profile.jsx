import React, { useMemo, useState } from "react";
import {
    UserRound,
    Mail,
    Building2,
    Users,
    CalendarDays,
    CircleUserRound,
    ShieldCheck,
    BriefcaseBusiness,
    Pencil,
    Share2,
    Download,
    Network,
    Phone,
    MapPin,
    LockKeyhole,
    SlidersHorizontal,
    Info,
    CheckCircle2,
} from "lucide-react";

import { useProfile } from "../../hooks/useProfile.jsx";

const Profile = () => {
    const { employee } = useProfile();

    const [activeTab, setActiveTab] = useState("Overview");

    const profile = useMemo(() => {
        return employee || {};
    }, [employee]);

    const {
        fullName = "Employee",
        email = "Not provided",
        avatarUrl,
        role = "Not provided",
        department = "Not provided",
        team = "Not provided",
        status = "active",
        currentActivity,
        isOnline,
        dateJoined,
        id,
    } = profile;

    const initials = fullName
        ? fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    const formattedJoinDate = dateJoined
        ? new Date(dateJoined).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Not provided";

    const tabs = [
        {
            label: "Overview",
            icon: UserRound,
        },
        {
            label: "Personal Info",
            icon: CircleUserRound,
        },
        {
            label: "Job & Team",
            icon: BriefcaseBusiness,
        },
        {
            label: "Security",
            icon: ShieldCheck,
        },
        {
            label: "Preferences",
            icon: SlidersHorizontal,
        },
    ];

    return (
        <div className="min-h-full bg-[var(--bg-main)] px-6 py-6 lg:px-8 xl:px-10">

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="mx-auto w-full max-w-[1450px]">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <span>Workspace</span>

                            <span>/</span>

                            <span className="text-[var(--text-secondary)]">
                                Profile
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                            My Profile
                        </h1>

                        <p className="mt-1 text-base text-[var(--text-secondary)]">
                            Manage your personal details, credentials,
                            and work preferences.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            className="
                                inline-flex
                                h-11
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                px-5
                                text-sm
                                font-semibold
                                text-[var(--text-primary)]
                                transition
                                hover:bg-[var(--bg-hover)]
                            "
                        >
                            <Share2 size={17} />

                            Share Profile
                        </button>

                        <button
                            type="button"
                            className="
                                inline-flex
                                h-11
                                items-center
                                gap-2
                                rounded-xl
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
                            <Pencil size={17} />

                            Edit Profile
                        </button>

                    </div>

                </div>


                {/* =========================================
                    PROFILE SUMMARY
                ========================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-[var(--border-color)]
                        bg-[var(--bg-card)]
                        p-5
                        shadow-sm
                        sm:p-6
                    "
                >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* LEFT */}

                        <div className="flex items-center gap-5">

                            {/* Avatar */}

                            <div className="relative shrink-0">

                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={fullName}
                                        className="
                                            h-24
                                            w-24
                                            rounded-2xl
                                            object-cover
                                            ring-1
                                            ring-[var(--border-color)]
                                        "
                                    />
                                ) : (
                                    <div
                                        className="
                                            flex
                                            h-24
                                            w-24
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-[var(--bg-hover)]
                                            text-2xl
                                            font-bold
                                            text-[var(--primary)]
                                            ring-1
                                            ring-[var(--border-color)]
                                        "
                                    >
                                        {initials}
                                    </div>
                                )}

                                <span
                                    className={`
                                        absolute
                                        bottom-1
                                        right-1
                                        h-4
                                        w-4
                                        rounded-full
                                        border-2
                                        border-[var(--bg-card)]
                                        ${
                                            isOnline
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                        }
                                    `}
                                />

                            </div>


                            {/* Employee information */}

                            <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-3">

                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                        {fullName}
                                    </h2>

                                    <span
                                        className="
                                            rounded-full
                                            bg-green-100
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-bold
                                            capitalize
                                            text-green-700
                                        "
                                    >
                                        {status}
                                    </span>

                                    {id && (
                                        <span
                                            className="
                                                rounded-full
                                                bg-[var(--bg-hover)]
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-medium
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            #{id}
                                        </span>
                                    )}

                                </div>

                                <p className="mt-1 text-base font-medium text-[var(--text-secondary)]">
                                    {role}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">

                                    <span className="flex items-center gap-1.5">
                                        <Mail size={15} />
                                        {email}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <Building2 size={15} />
                                        {department}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <Users size={15} />
                                        {team}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div className="flex flex-col gap-4 lg:min-w-[280px] lg:border-l lg:border-[var(--border-color)] lg:pl-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--primary)]">
                                    <CalendarDays size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                                        Joined
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                                        {formattedJoinDate}
                                    </p>
                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--primary)]">
                                    <CircleUserRound size={19} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                                        Current activity
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                                        {currentActivity || "No activity available"}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    TABS
                ========================================= */}

                <div className="mt-5 border-b border-[var(--border-color)]">

                    <div className="flex gap-1 overflow-x-auto">

                        {tabs.map((tab) => {

                            const Icon = tab.icon;

                            const isActive =
                                activeTab === tab.label;

                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(tab.label)
                                    }
                                    className={`
                                        flex
                                        shrink-0
                                        items-center
                                        gap-2
                                        border-b-2
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition
                                        ${
                                            isActive
                                                ? "border-[var(--primary)] text-[var(--primary)]"
                                                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }
                                    `}
                                >
                                    <Icon size={16} />

                                    {tab.label}
                                </button>
                            );
                        })}

                    </div>

                </div>


                {/* =========================================
                    CONTENT
                ========================================= */}

                {activeTab === "Overview" && (
                    <Overview
                        employee={profile}
                        role={role}
                        department={department}
                        team={team}
                        email={email}
                        formattedJoinDate={formattedJoinDate}
                    />
                )}

                {activeTab === "Personal Info" && (
                    <PersonalInfo employee={profile} />
                )}

                {activeTab === "Job & Team" && (
                    <JobTeam
                        employee={profile}
                        role={role}
                        department={department}
                        team={team}
                    />
                )}

                {activeTab === "Security" && (
                    <EmptySection
                        icon={LockKeyhole}
                        title="Security"
                        description="Security and authentication settings can be added here."
                    />
                )}

                {activeTab === "Preferences" && (
                    <EmptySection
                        icon={SlidersHorizontal}
                        title="Preferences"
                        description="Your workspace preferences can be managed here."
                    />
                )}

            </div>

        </div>
    );
};


/* =====================================================
   OVERVIEW
===================================================== */

const Overview = ({
    employee,
    role,
    department,
    team,
    email,
    formattedJoinDate,
}) => {

    return (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

            {/* LEFT */}

            <div className="space-y-6">

                {/* About */}

                <ProfileCard
                    icon={Info}
                    title="About Me"
                    action="Edit"
                >
                    <p className="text-base leading-7 text-[var(--text-secondary)]">
                        No bio has been provided yet.
                    </p>
                </ProfileCard>


                {/* Contact */}

                <ProfileCard
                    icon={CircleUserRound}
                    title="Personal & Contact Information"
                    badge="Employee Records"
                >

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                        <InfoField
                            label="Full Name"
                            value={employee.fullName}
                            icon={UserRound}
                        />

                        <InfoField
                            label="Work Email"
                            value={email}
                            icon={Mail}
                        />

                        <InfoField
                            label="Phone Number"
                            value="Not provided"
                            icon={Phone}
                        />

                        <InfoField
                            label="Location"
                            value="Not provided"
                            icon={MapPin}
                        />

                        <InfoField
                            label="Joined"
                            value={formattedJoinDate}
                            icon={CalendarDays}
                        />

                        <InfoField
                            label="Employee ID"
                            value={employee.id}
                            icon={CircleUserRound}
                        />

                    </div>

                </ProfileCard>


                {/* Job */}

                <ProfileCard
                    icon={BriefcaseBusiness}
                    title="Role & Department"
                >

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                        <InfoField
                            label="Job Title"
                            value={role}
                        />

                        <InfoField
                            label="Department"
                            value={department}
                        />

                        <InfoField
                            label="Team"
                            value={team}
                        />

                        <InfoField
                            label="Status"
                            value={employee.status}
                        />

                    </div>

                </ProfileCard>

            </div>


            {/* RIGHT */}

            <div className="space-y-6">

                {/* Quick Stats */}

                <ProfileCard
                    icon={CheckCircle2}
                    title="Current Status"
                >

                    <div className="grid grid-cols-2 gap-3">

                        <StatBox
                            label="Status"
                            value={employee.status || "N/A"}
                        />

                        <StatBox
                            label="Online"
                            value={
                                employee.isOnline
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <StatBox
                            label="Activity"
                            value={
                                employee.currentActivity ||
                                "None"
                            }
                        />

                        <StatBox
                            label="Team"
                            value={team}
                        />

                    </div>

                </ProfileCard>


                {/* Organization */}

                <ProfileCard
                    icon={Users}
                    title="Organization"
                >

                    <div className="space-y-4">

                        <InfoRow
                            label="Department"
                            value={department}
                        />

                        <InfoRow
                            label="Team"
                            value={team}
                        />

                        <InfoRow
                            label="Role"
                            value={role}
                        />

                    </div>

                </ProfileCard>


                {/* Assets placeholder */}

                <ProfileCard
                    icon={BriefcaseBusiness}
                    title="Assigned Assets"
                >

                    <div className="rounded-xl border border-dashed border-[var(--border-color)] p-5 text-center">

                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                            No asset information available
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                            Asset information is not included in
                            the current employee API response.
                        </p>

                    </div>

                </ProfileCard>

            </div>

        </div>
    );
};


/* =====================================================
   PERSONAL INFO
===================================================== */

const PersonalInfo = ({ employee }) => {

    return (
        <div className="mt-6">

            <ProfileCard
                icon={CircleUserRound}
                title="Personal Information"
            >

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <InfoField
                        label="Full Name"
                        value={employee.fullName}
                    />

                    <InfoField
                        label="Email Address"
                        value={employee.email}
                    />

                    <InfoField
                        label="Employee ID"
                        value={employee.id}
                    />

                    <InfoField
                        label="Account Status"
                        value={employee.status}
                    />

                    <InfoField
                        label="Phone"
                        value="Not provided"
                    />

                    <InfoField
                        label="Address"
                        value="Not provided"
                    />

                </div>

            </ProfileCard>

        </div>
    );
};


/* =====================================================
   JOB & TEAM
===================================================== */

const JobTeam = ({
    employee,
    role,
    department,
    team,
}) => {

    return (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

            <ProfileCard
                icon={BriefcaseBusiness}
                title="Job Information"
            >

                <div className="space-y-5">

                    <InfoRow
                        label="Job Title"
                        value={role}
                    />

                    <InfoRow
                        label="Department"
                        value={department}
                    />

                    <InfoRow
                        label="Team"
                        value={team}
                    />

                    <InfoRow
                        label="Status"
                        value={employee.status}
                    />

                </div>

            </ProfileCard>


            <ProfileCard
                icon={Users}
                title="Team Information"
            >

                <div className="rounded-xl bg-[var(--bg-hover)] p-5">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-card)] text-[var(--primary)]">
                            <Users size={22} />
                        </div>

                        <div>
                            <p className="text-base font-bold text-[var(--text-primary)]">
                                {team}
                            </p>

                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                {department}
                            </p>
                        </div>

                    </div>

                </div>

            </ProfileCard>

        </div>
    );
};


/* =====================================================
   REUSABLE CARD
===================================================== */

const ProfileCard = ({
    icon: Icon,
    title,
    action,
    badge,
    children,
}) => {

    return (
        <section
            className="
                rounded-2xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-6
                shadow-sm
            "
        >

            <div className="mb-6 flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[var(--bg-hover)]
                            text-[var(--primary)]
                        "
                    >
                        <Icon size={19} />
                    </div>

                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {title}
                    </h3>

                </div>

                {action && (
                    <button
                        type="button"
                        className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--primary)]"
                    >
                        {action}
                    </button>
                )}

                {badge && (
                    <span className="rounded-full bg-[var(--bg-hover)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                        {badge}
                    </span>
                )}

            </div>

            {children}

        </section>
    );
};


/* =====================================================
   INFO FIELD
===================================================== */

const InfoField = ({
    label,
    value,
    icon: Icon,
}) => {

    return (
        <div>

            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                {label}
            </p>

            <div className="flex items-center gap-2">

                {Icon && (
                    <Icon
                        size={15}
                        className="shrink-0 text-[var(--text-muted)]"
                    />
                )}

                <p className="break-words text-sm font-semibold text-[var(--text-primary)]">
                    {value || "Not provided"}
                </p>

            </div>

        </div>
    );
};


/* =====================================================
   INFO ROW
===================================================== */

const InfoRow = ({
    label,
    value,
}) => {

    return (
        <div className="flex flex-col gap-1 border-b border-[var(--border-color)] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">

            <span className="text-sm font-medium text-[var(--text-muted)]">
                {label}
            </span>

            <span className="text-sm font-bold text-[var(--text-primary)] sm:text-right">
                {value || "Not provided"}
            </span>

        </div>
    );
};


/* =====================================================
   STAT BOX
===================================================== */

const StatBox = ({
    label,
    value,
}) => {

    return (
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-hover)] p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {label}
            </p>

            <p className="mt-2 truncate text-base font-bold capitalize text-[var(--text-primary)]">
                {value || "N/A"}
            </p>

        </div>
    );
};


/* =====================================================
   EMPTY SECTION
===================================================== */

const EmptySection = ({
    icon: Icon,
    title,
    description,
}) => {

    return (
        <div className="mt-6">

            <ProfileCard
                icon={Icon}
                title={title}
            >

                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] px-6 text-center">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-hover)] text-[var(--primary)]">
                        <Icon size={25} />
                    </div>

                    <h4 className="text-base font-bold text-[var(--text-primary)]">
                        {title}
                    </h4>

                    <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                        {description}
                    </p>

                </div>

            </ProfileCard>

        </div>
    );
};


export default Profile;