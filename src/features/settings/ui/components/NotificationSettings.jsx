import React from "react";
import {
    Bell,
} from "lucide-react";

import SettingsSection from "./SettingsSection.jsx";

const NotificationSettings = ({
    notifications,
    setNotifications,
}) => {

    const toggleNotification = (key) => {

        setNotifications((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));

    };


    const items = [
        {
            key: "email",
            title: "Email Notifications",
            description:
                "Weekly summaries and direct messages.",
        },
        {
            key: "aiInsights",
            title: "AI Insights Alert",
            description:
                "Get notified when AI discovers a pattern.",
        },
        {
            key: "desktop",
            title: "Desktop Push",
            description:
                "Real-time alerts in your browser.",
        },
    ];


    return (
        <SettingsSection
            icon={Bell}
            title="Notification Settings"
        >

            <div>

                {items.map((item, index) => (

                    <div
                        key={item.key}
                        className={`
                            flex
                            items-center
                            justify-between
                            py-4
                            ${
                                index !== items.length - 1
                                    ? "border-b border-[var(--border-color)]"
                                    : ""
                            }
                        `}
                    >

                        <div>

                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {item.title}
                            </p>

                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                {item.description}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                toggleNotification(item.key)
                            }
                            className={`
                                relative
                                h-6
                                w-11
                                rounded-full
                                transition
                                ${
                                    notifications[item.key]
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
                                    transition-all
                                    ${
                                        notifications[item.key]
                                            ? "left-6"
                                            : "left-1"
                                    }
                                `}
                            />

                        </button>

                    </div>

                ))}

            </div>

        </SettingsSection>
    );
};

export default NotificationSettings;