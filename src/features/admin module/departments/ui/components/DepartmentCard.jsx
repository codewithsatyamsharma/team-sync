import React from "react";

import {
    Users,
    Building2,
    Palette,
    Megaphone,
    BriefcaseBusiness,
    ChevronRight,
} from "lucide-react";


const departmentIcons = {
    Design: Palette,
    Engineering: Users,
    Management: Building2,
    Marketing: Megaphone,
    Operations: BriefcaseBusiness,
};


const DepartmentCard = ({
    department,
    onClick,
}) => {

    const Icon =
        departmentIcons[department.name] ||
        Building2;


    const head =
        department.head ||
        department.departmentHead ||
        null;


    const headName =
        head?.fullName ||
        head?.name ||
        department.headName ||
        "No head assigned";


    const headRole =
        head?.role ||
        "Department Head";


    const avatar =
        head?.avatarUrl ||
        head?.avatar ||
        null;


    const initials = headName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();


    const employeeCount =
        department.employeeCount ??
        department.employeesCount ??
        department.employees?.length ??
        0;


    return (

        <button
            type="button"
            onClick={() => onClick?.(department)}
            className="
                group
                w-full
                min-h-[260px]
                rounded-2xl
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-6
                text-left
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--primary)]
            "
        >

            {/* ICON */}

            <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--bg-hover)]
                "
            >

                <Icon
                    size={23}
                    strokeWidth={2}
                    className="
                        text-[var(--primary)]
                    "
                />

            </div>


            {/* DEPARTMENT NAME */}

            <h2
                className="
                    mt-5
                    text-xl
                    font-bold
                    tracking-tight
                    text-[var(--text-primary)]
                "
            >
                {department.name}
            </h2>


            {/* EMPLOYEE COUNT */}

            <div
                className="
                    mt-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-[var(--text-secondary)]
                "
            >

                <Users size={16} />

                <span>
                    {employeeCount} Employees
                </span>

            </div>


            {/* DIVIDER */}

            <div
                className="
                    my-6
                    border-t
                    border-[var(--border-color)]
                "
            />


            {/* DEPARTMENT HEAD */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    {/* AVATAR */}

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            bg-[var(--bg-hover)]
                            text-sm
                            font-bold
                            text-[var(--primary)]
                        "
                    >

                        {avatar ? (

                            <img
                                src={avatar}
                                alt={headName}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            initials

                        )}

                    </div>


                    {/* DETAILS */}

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-[var(--text-primary)]
                            "
                        >
                            {headName}
                        </p>


                        <p
                            className="
                                mt-1
                                text-xs
                                font-medium
                                text-[var(--text-secondary)]
                            "
                        >
                            {headRole}
                        </p>

                    </div>

                </div>


                <ChevronRight
                    size={20}
                    className="
                        text-[var(--text-muted)]
                        transition-transform
                        group-hover:translate-x-1
                    "
                />

            </div>

        </button>
    );
};


export default DepartmentCard;