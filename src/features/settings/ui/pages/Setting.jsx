import { useDispatch } from "react-redux";
import { toggleTheme } from "../../../../shared/state/themeSlice";
import { useSetting } from "../../hooks/useSetting";
import React, { useEffect, useState } from "react";

import {
    User,
    Palette,
    Bell,
    Shield,
    Moon,
    Sun,
    Check,
    Mail,
    Sparkles,
    Monitor,
    Pencil,
    Save,
    RotateCcw,
} from "lucide-react";




const Setting = () => {

    const dispatch = useDispatch();

    const {
        employee,
        theme,
    } = useSetting();


    // =========================================
    // PROFILE STATE
    // =========================================

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        bio: "",
    });


    // =========================================
    // NOTIFICATION STATE
    // =========================================

    const [notifications, setNotifications] = useState({
        email: true,
        aiInsights: true,
        desktop: false,
    });


    // =========================================
    // SAVE STATE
    // =========================================

    const [saving, setSaving] = useState(false);


    // =========================================
    // LOAD EMPLOYEE DATA
    // =========================================

    useEffect(() => {

        if (!employee) return;

        setProfile({
            fullName: employee.fullName || "",
            email: employee.email || "",
            bio: employee.bio || "",
        });

    }, [employee]);


    // =========================================
    // PROFILE CHANGE
    // =========================================

    const handleProfileChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================
    // NOTIFICATION TOGGLE
    // =========================================

    const handleNotificationToggle = (name) => {

        setNotifications((previous) => ({
            ...previous,
            [name]: !previous[name],
        }));

    };


    // =========================================
    // THEME CHANGE
    // =========================================

    const handleThemeChange = (selectedTheme) => {

        if (theme === selectedTheme) {
            return;
        }

        dispatch(toggleTheme());

    };


    // =========================================
    // DISCARD
    // =========================================

    const handleDiscard = () => {

        if (!employee) return;

        setProfile({
            fullName: employee.fullName || "",
            email: employee.email || "",
            bio: employee.bio || "",
        });

        setNotifications({
            email: true,
            aiInsights: true,
            desktop: false,
        });

    };


    // =========================================
    // SAVE
    // =========================================

    const handleSave = async () => {

        try {

            setSaving(true);

            /*
             * There is currently no settings/profile
             * update API provided.
             *
             * So for now we only keep the changes
             * inside this page.
             *
             * When you have the API, we can replace
             * this section with:
             *
             * await updateProfile(profile)
             * await updateNotifications(notifications)
             */

            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 500)
            );

            console.log(
                "Profile:",
                profile
            );

            console.log(
                "Notifications:",
                notifications
            );

        } catch (error) {

            console.error(
                "Failed to save settings:",
                error
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================
    // NO EMPLOYEE
    // =========================================

    if (!employee) {

        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[var(--bg-main)]
                    text-[var(--text-primary)]
                "
            >

                <p
                    className="
                        text-base
                        text-[var(--text-muted)]
                    "
                >
                    Loading settings...
                </p>

            </div>
        );

    }


    return (

        <div
            className="
                min-h-screen
                bg-[var(--bg-main)]
                text-[var(--text-primary)]
                transition-colors
                duration-200
            "
        >

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                    px-8
                    py-8
                "
            >

                <div className="mb-8">

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[var(--text-primary)]
                        "
                    >
                        Workspace Settings
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        Manage your personal profile,
                        preferences, and notification triggers.
                    </p>

                </div>


                {/* =================================
                    MAIN CONTENT
                ================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        lg:grid-cols-[170px_minmax(0,1fr)]
                    "
                >

                    {/* =================================
                        SETTINGS NAVIGATION
                    ================================== */}

                    <aside>

                        <div
                            className="
                                sticky
                                top-8
                                space-y-1
                            "
                        >

                            <button
                                type="button"
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    bg-[var(--bg-hover)]
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-semibold
                                    text-[var(--text-primary)]
                                "
                            >
                                <User size={17} />

                                Profile Settings
                            </button>


                            <button
                                type="button"
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[var(--text-secondary)]
                                    transition
                                    hover:bg-[var(--bg-hover)]
                                    hover:text-[var(--text-primary)]
                                "
                            >
                                <Palette size={17} />

                                Appearance
                            </button>


                            <button
                                type="button"
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[var(--text-secondary)]
                                    transition
                                    hover:bg-[var(--bg-hover)]
                                    hover:text-[var(--text-primary)]
                                "
                            >
                                <Bell size={17} />

                                Notifications
                            </button>


                            <button
                                type="button"
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[var(--text-secondary)]
                                    transition
                                    hover:bg-[var(--bg-hover)]
                                    hover:text-[var(--text-primary)]
                                "
                            >
                                <Shield size={17} />

                                Security
                            </button>

                        </div>

                    </aside>


                    {/* =================================
                        SETTINGS CONTENT
                    ================================== */}

                    <main className="space-y-6">


                        {/* =================================
                            PROFILE SETTINGS
                        ================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                p-6
                                shadow-[var(--shadow-md)]
                            "
                        >

                            {/* Header */}

                            <div
                                className="
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[var(--bg-hover)]
                                        text-[var(--primary)]
                                    "
                                >
                                    <User size={20} />
                                </div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    Profile Settings
                                </h2>

                            </div>


                            {/* Profile */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-6
                                    md:grid-cols-[110px_minmax(0,1fr)]
                                "
                            >

                                {/* Avatar */}

                                <div>

                                    <div
                                        className="
                                            relative
                                            h-24
                                            w-24
                                        "
                                    >

                                        {employee.avatarUrl ? (

                                            <img
                                                src={employee.avatarUrl}
                                                alt={
                                                    employee.fullName ||
                                                    "Profile"
                                                }
                                                className="
                                                    h-24
                                                    w-24
                                                    rounded-xl
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
                                                    rounded-xl
                                                    bg-[var(--primary)]
                                                    text-2xl
                                                    font-bold
                                                    text-white
                                                "
                                            >
                                                {employee.fullName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                        )}


                                        <button
                                            type="button"
                                            className="
                                                absolute
                                                -bottom-2
                                                -right-2
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-[var(--border-color)]
                                                bg-[var(--bg-hover)]
                                                text-[var(--text-primary)]
                                                shadow
                                                transition
                                                hover:bg-[var(--primary)]
                                                hover:text-white
                                            "
                                        >
                                            <Pencil size={14} />
                                        </button>

                                    </div>

                                </div>


                                {/* Fields */}

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        md:grid-cols-2
                                    "
                                >

                                    {/* Full Name */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profile.fullName}
                                            onChange={
                                                handleProfileChange
                                            }
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
                                                transition
                                                focus:border-[var(--primary)]
                                                focus:ring-2
                                                focus:ring-[var(--primary)]/20
                                            "
                                        />

                                    </div>


                                    {/* Email */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={
                                                handleProfileChange
                                            }
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
                                                transition
                                                focus:border-[var(--primary)]
                                                focus:ring-2
                                                focus:ring-[var(--primary)]/20
                                            "
                                        />

                                    </div>


                                    {/* Role */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            Role
                                        </label>

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border-color)]
                                                bg-[var(--bg-main)]
                                                px-4
                                                py-3
                                                text-sm
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            {employee.role || "—"}
                                        </div>

                                    </div>


                                    {/* Department */}

                                    <div>

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            Department
                                        </label>

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-[var(--border-color)]
                                                bg-[var(--bg-main)]
                                                px-4
                                                py-3
                                                text-sm
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            {employee.department || "—"}
                                        </div>

                                    </div>


                                    {/* Bio */}

                                    <div className="md:col-span-2">

                                        <label
                                            className="
                                                mb-2
                                                block
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            Bio
                                        </label>

                                        <textarea
                                            name="bio"
                                            value={profile.bio}
                                            onChange={
                                                handleProfileChange
                                            }
                                            rows={4}
                                            placeholder="Tell us something about yourself..."
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
                                                transition
                                                placeholder:text-[var(--text-muted)]
                                                focus:border-[var(--primary)]
                                                focus:ring-2
                                                focus:ring-[var(--primary)]/20
                                            "
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =================================
                            APPEARANCE
                        ================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                p-6
                                shadow-[var(--shadow-md)]
                            "
                        >

                            <div
                                className="
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[var(--bg-hover)]
                                        text-[var(--primary)]
                                    "
                                >
                                    <Palette size={20} />
                                </div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    Appearance
                                </h2>

                            </div>


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-2
                                "
                            >

                                {/* DARK */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleThemeChange("dark")
                                    }
                                    className={`
                                        relative
                                        rounded-xl
                                        border
                                        p-5
                                        text-left
                                        transition
                                        ${
                                            theme === "dark"
                                                ? `
                                                    border-[var(--primary)]
                                                    ring-2
                                                    ring-[var(--primary)]/30
                                                    bg-[var(--bg-hover)]
                                                `
                                                : `
                                                    border-[var(--border-color)]
                                                    hover:bg-[var(--bg-hover)]
                                                `
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-[var(--bg-main)]
                                                text-[var(--primary)]
                                            "
                                        >
                                            <Moon size={19} />
                                        </div>


                                        {theme === "dark" && (

                                            <div
                                                className="
                                                    flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[var(--primary)]
                                                    text-white
                                                "
                                            >
                                                <Check size={14} />
                                            </div>

                                        )}

                                    </div>


                                    <h3
                                        className="
                                            font-semibold
                                            text-[var(--text-primary)]
                                        "
                                    >
                                        Dark Mode
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[var(--text-muted)]
                                        "
                                    >
                                        Recommended for focus
                                    </p>

                                </button>


                                {/* LIGHT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleThemeChange("light")
                                    }
                                    className={`
                                        relative
                                        rounded-xl
                                        border
                                        p-5
                                        text-left
                                        transition
                                        ${
                                            theme === "light"
                                                ? `
                                                    border-[var(--primary)]
                                                    ring-2
                                                    ring-[var(--primary)]/30
                                                    bg-[var(--bg-hover)]
                                                `
                                                : `
                                                    border-[var(--border-color)]
                                                    hover:bg-[var(--bg-hover)]
                                                `
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-[var(--bg-main)]
                                                text-[var(--primary)]
                                            "
                                        >
                                            <Sun size={19} />
                                        </div>


                                        {theme === "light" && (

                                            <div
                                                className="
                                                    flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[var(--primary)]
                                                    text-white
                                                "
                                            >
                                                <Check size={14} />
                                            </div>

                                        )}

                                    </div>


                                    <h3
                                        className="
                                            font-semibold
                                            text-[var(--text-primary)]
                                        "
                                    >
                                        Light Mode
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[var(--text-muted)]
                                        "
                                    >
                                        High contrast for daylight
                                    </p>

                                </button>

                            </div>

                        </section>


                        {/* =================================
                            NOTIFICATIONS
                        ================================== */}

                        <section
                            className="
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                p-6
                                shadow-[var(--shadow-md)]
                            "
                        >

                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[var(--bg-hover)]
                                        text-[var(--primary)]
                                    "
                                >
                                    <Bell size={20} />
                                </div>

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    Notification Settings
                                </h2>

                            </div>


                            <div
                                className="
                                    divide-y
                                    divide-[var(--border-color)]
                                "
                            >

                                {/* EMAIL */}

                                <NotificationRow
                                    icon={Mail}
                                    title="Email Notifications"
                                    description="Weekly summaries and direct messages."
                                    enabled={
                                        notifications.email
                                    }
                                    onToggle={() =>
                                        handleNotificationToggle(
                                            "email"
                                        )
                                    }
                                />


                                {/* AI */}

                                <NotificationRow
                                    icon={Sparkles}
                                    title="AI Insights Alert"
                                    description="Get notified when AI discovers a pattern."
                                    enabled={
                                        notifications.aiInsights
                                    }
                                    onToggle={() =>
                                        handleNotificationToggle(
                                            "aiInsights"
                                        )
                                    }
                                />


                                {/* DESKTOP */}

                                <NotificationRow
                                    icon={Monitor}
                                    title="Desktop Push"
                                    description="Real-time alerts in your browser."
                                    enabled={
                                        notifications.desktop
                                    }
                                    onToggle={() =>
                                        handleNotificationToggle(
                                            "desktop"
                                        )
                                    }
                                />

                            </div>

                        </section>


                        {/* =================================
                            BOTTOM ACTIONS
                        ================================== */}

                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-3
                                pb-8
                            "
                        >

                            <button
                                type="button"
                                onClick={handleDiscard}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[var(--text-secondary)]
                                    transition
                                    hover:bg-[var(--bg-hover)]
                                    hover:text-[var(--text-primary)]
                                "
                            >
                                <RotateCcw size={16} />

                                Discard Changes
                            </button>


                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-[var(--primary)]
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-md
                                    transition
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                {saving ? (

                                    <>
                                        Saving...
                                    </>

                                ) : (

                                    <>
                                        <Save size={16} />

                                        Save Changes
                                    </>

                                )}

                            </button>

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
};


// =====================================================
// NOTIFICATION ROW
// =====================================================

const NotificationRow = ({
    icon: Icon,
    title,
    description,
    enabled,
    onToggle,
}) => {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-6
                py-5
            "
        >

            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[var(--bg-hover)]
                        text-[var(--text-secondary)]
                    "
                >
                    <Icon size={17} />
                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-semibold
                            text-[var(--text-primary)]
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-[var(--text-muted)]
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>


            {/* SWITCH */}

            <button
                type="button"
                onClick={onToggle}
                aria-pressed={enabled}
                className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    ${
                        enabled
                            ? "bg-[var(--primary)]"
                            : "bg-[var(--border-color)]"
                    }
                `}
            >

                <span
                    className={`
                        absolute
                        top-1
                        h-4
                        w-4
                        rounded-full
                        bg-white
                        shadow
                        transition
                        ${
                            enabled
                                ? "left-6"
                                : "left-1"
                        }
                    `}
                />

            </button>

        </div>

    );
};


export default Setting;