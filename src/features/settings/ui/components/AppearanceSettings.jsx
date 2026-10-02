import React from "react";
import {
    Palette,
    Moon,
    Sun,
    Check,
} from "lucide-react";

import SettingsSection from "./SettingsSection.jsx";

const AppearanceSettings = ({
    theme,
    setTheme,
}) => {

    return (
        <SettingsSection
            icon={Palette}
            title="Appearance"
        >

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* DARK */}

                <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`
                        relative
                        flex
                        items-center
                        gap-4
                        rounded-xl
                        border
                        p-5
                        text-left
                        transition
                        ${
                            theme === "dark"
                                ? "border-[var(--primary)] bg-[var(--bg-hover)]"
                                : "border-[var(--border-color)]"
                        }
                    `}
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-lg
                            bg-[var(--bg-hover)]
                        "
                    >
                        <Moon size={20} />
                    </div>

                    <div className="flex-1">

                        <p className="font-semibold text-[var(--text-primary)]">
                            Dark Mode
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            Recommended for focus
                        </p>

                    </div>

                    {theme === "dark" && (
                        <Check
                            size={20}
                            className="text-[var(--primary)]"
                        />
                    )}

                </button>


                {/* LIGHT */}

                <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`
                        relative
                        flex
                        items-center
                        gap-4
                        rounded-xl
                        border
                        p-5
                        text-left
                        transition
                        ${
                            theme === "light"
                                ? "border-[var(--primary)] bg-[var(--bg-hover)]"
                                : "border-[var(--border-color)]"
                        }
                    `}
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-lg
                            bg-[var(--bg-hover)]
                        "
                    >
                        <Sun size={20} />
                    </div>

                    <div className="flex-1">

                        <p className="font-semibold text-[var(--text-primary)]">
                            Light Mode
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            High contrast for daylight
                        </p>

                    </div>

                    {theme === "light" && (
                        <Check
                            size={20}
                            className="text-[var(--primary)]"
                        />
                    )}

                </button>

            </div>

        </SettingsSection>
    );
};

export default AppearanceSettings;