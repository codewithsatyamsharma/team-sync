import React from "react";

const SettingsSection = ({
    icon: Icon,
    title,
    children,
    className = "",
}) => {
    return (
        <section
            className={`
                rounded-xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-5
                shadow-sm
                ${className}
            `}
        >
            <div className="mb-5 flex items-center gap-3">
                {Icon && (
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
                        <Icon size={20} />
                    </div>
                )}

                <h2
                    className="
                        text-xl
                        font-bold
                        text-[var(--text-primary)]
                    "
                >
                    {title}
                </h2>
            </div>

            {children}
        </section>
    );
};

export default SettingsSection;