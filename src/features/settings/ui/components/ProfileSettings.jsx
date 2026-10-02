import React from "react";
import {
    User,
    Pencil,
} from "lucide-react";

import SettingsSection from "./SettingsSection.jsx";

const ProfileSettings = ({
    employee,
    formData,
    setFormData,
}) => {

    if (!employee) {
        return (
            <SettingsSection
                icon={User}
                title="Profile Settings"
            >
                <p className="text-sm text-[var(--text-muted)]">
                    Loading profile...
                </p>
            </SettingsSection>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    return (
        <SettingsSection
            icon={User}
            title="Profile Settings"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[110px_1fr]">

                {/* AVATAR */}

                <div className="flex justify-center md:justify-start">
                    <div className="relative">

                        <div
                            className="
                                h-24
                                w-24
                                overflow-hidden
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-hover)]
                            "
                        >
                            {employee.avatarUrl ? (
                                <img
                                    src={employee.avatarUrl}
                                    alt={employee.fullName}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        flex
                                        h-full
                                        w-full
                                        items-center
                                        justify-center
                                        text-2xl
                                        font-bold
                                        text-[var(--primary)]
                                    "
                                >
                                    {employee.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="
                                absolute
                                -bottom-2
                                -right-2
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-hover)]
                                text-[var(--primary)]
                                shadow
                            "
                        >
                            <Pencil size={15} />
                        </button>

                    </div>
                </div>


                {/* FORM */}

                <div className="space-y-5">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

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
                                value={formData.fullName}
                                onChange={handleChange}
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-3
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
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--bg-main)]
                                    px-3
                                    text-sm
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            />
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
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Tell us about yourself..."
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-main)]
                                px-3
                                py-3
                                text-sm
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--primary)]
                            "
                        />
                    </div>


                    {/* READ ONLY EMPLOYEE INFORMATION */}

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                        <div>
                            <p className="text-xs text-[var(--text-muted)]">
                                Role
                            </p>

                            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                                {employee.role || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--text-muted)]">
                                Department
                            </p>

                            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                                {employee.department || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--text-muted)]">
                                Team
                            </p>

                            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                                {employee.team || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[var(--text-muted)]">
                                Status
                            </p>

                            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                                {employee.status || "—"}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </SettingsSection>
    );
};

export default ProfileSettings;