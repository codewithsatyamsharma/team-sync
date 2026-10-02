import React, {
    useMemo,
    useState,
} from "react";

import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { useDepartment } from "../../hooks/useDepartment.jsx";

import DepartmentCard from "../components/DepartmentCard.jsx";
import CreateDepartmentCard from "../components/CreateDepartmentCard.jsx";


const Department = () => {

    // =========================================
    // HOOK
    // =========================================

    const {
        departments,
        loading,
        fetching,
        error,
    } = useDepartment();


    // =========================================
    // LOCAL STATE
    // =========================================

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const departmentsPerPage = 5;


    // =========================================
    // SEARCH
    // =========================================

    const filteredDepartments = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        if (!searchValue) {
            return departments;
        }


        return departments.filter(
            (department) =>
                department.name
                    ?.toLowerCase()
                    .includes(searchValue)
        );

    }, [
        departments,
        search,
    ]);


    // =========================================
    // PAGINATION
    // =========================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredDepartments.length /
            departmentsPerPage
        )
    );


    const currentDepartments =
        filteredDepartments.slice(
            (page - 1) *
                departmentsPerPage,

            page *
                departmentsPerPage
        );


    // =========================================
    // SEARCH CHANGE
    // =========================================

    const handleSearch = (event) => {

        setSearch(event.target.value);

        setPage(1);

    };


    // =========================================
    // PREVIOUS
    // =========================================

    const handlePrevious = () => {

        setPage((previous) =>
            Math.max(
                1,
                previous - 1
            )
        );

    };


    // =========================================
    // NEXT
    // =========================================

    const handleNext = () => {

        setPage((previous) =>
            Math.min(
                totalPages,
                previous + 1
            )
        );

    };


    // =========================================
    // CREATE
    // =========================================

    const handleCreateDepartment = () => {

        console.log(
            "Create department clicked"
        );

        // Later:
        // setCreateModalOpen(true)

    };


    // =========================================
    // CARD CLICK
    // =========================================

    const handleDepartmentClick = (
        department
    ) => {

        console.log(
            "Selected department:",
            department
        );

        // Later:
        // open edit/details modal

    };


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div
                className="
                    min-h-screen
                    bg-[var(--bg-main)]
                    p-10
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-[1400px]
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-8
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-red-600
                        "
                    >
                        Failed to load departments
                    </h2>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-red-500
                        "
                    >
                        {error.response?.data?.message ||
                            error.message ||
                            "Something went wrong."}
                    </p>

                </div>

            </div>

        );
    }


    return (

        <div
            className="
                min-h-screen
                bg-[var(--bg-main)]
                text-[var(--text-primary)]
            "
        >

            {/* ===================================== */}
            {/* TOP SEARCH BAR */}
            {/* ===================================== */}

            <div
                className="
                    border-b
                    border-[var(--border-color)]
                    px-8
                    py-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-6
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
                            relative
                            w-full
                            max-w-[520px]
                        "
                    >

                        <Search
                            size={21}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-[var(--text-muted)]
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search workspace..."
                            className="
                                h-12
                                w-full
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                pl-12
                                pr-4
                                text-base
                                text-[var(--text-primary)]
                                placeholder:text-[var(--text-muted)]
                                outline-none
                                transition
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary)]
                                focus:ring-opacity-20
                            "
                        />

                    </div>


                    {/* FILTERS */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                text-[var(--text-secondary)]
                                transition
                                hover:bg-[var(--bg-hover)]
                            "
                        >

                            <SlidersHorizontal
                                size={19}
                            />

                        </button>


                        <button
                            type="button"
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--bg-card)]
                                text-[var(--text-secondary)]
                                transition
                                hover:bg-[var(--bg-hover)]
                            "
                        >

                            <ArrowUpDown
                                size={19}
                            />

                        </button>

                    </div>

                </div>

            </div>


            {/* ===================================== */}
            {/* MAIN */}
            {/* ===================================== */}

            <main
                className="
                    mx-auto
                    w-full
                    max-w-[1500px]
                    px-8
                    py-10
                "
            >

                {/* HEADER */}

                <div className="mb-8">

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[var(--text-primary)]
                        "
                    >
                        Departments
                    </h1>


                    <p
                        className="
                            mt-2
                            text-base
                            leading-6
                            text-[var(--text-secondary)]
                        "
                    >
                        Manage organizational units and
                        leadership roles across the enterprise.
                    </p>

                </div>


                {/* ================================= */}
                {/* LOADING */}
                {/* ================================= */}

                {loading ? (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {[1, 2, 3, 4, 5].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="
                                        min-h-[260px]
                                        animate-pulse
                                        rounded-2xl
                                        bg-[var(--bg-hover)]
                                    "
                                />

                            )
                        )}

                    </div>

                ) : (

                    <>

                        {/* ================================= */}
                        {/* DEPARTMENT GRID */}
                        {/* ================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {currentDepartments.map(
                                (department) => (

                                    <DepartmentCard
                                        key={
                                            department._id ||
                                            department.id
                                        }
                                        department={
                                            department
                                        }
                                        onClick={
                                            handleDepartmentClick
                                        }
                                    />

                                )
                            )}


                            {/* CREATE */}

                            <CreateDepartmentCard
                                onClick={
                                    handleCreateDepartment
                                }
                            />

                        </div>


                        {/* EMPTY */}

                        {currentDepartments.length ===
                            0 && (

                            <div
                                className="
                                    py-20
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-lg
                                        font-semibold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    No departments found
                                </p>


                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    Try changing your search.
                                </p>

                            </div>

                        )}


                        {/* ================================= */}
                        {/* FOOTER */}
                        {/* ================================= */}

                        <div
                            className="
                                mt-10
                                flex
                                flex-col
                                gap-5
                                border-t
                                border-[var(--border-color)]
                                pt-6
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-[var(--text-secondary)]
                                "
                            >

                                Showing{" "}

                                <span
                                    className="
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {currentDepartments.length}
                                </span>

                                {" "}of{" "}

                                <span
                                    className="
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {filteredDepartments.length}
                                </span>

                                {" "}departments

                            </p>


                            {/* PAGINATION */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={
                                        handlePrevious
                                    }
                                    className="
                                        flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-[var(--border-color)]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-[var(--text-secondary)]
                                        transition
                                        hover:bg-[var(--bg-hover)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    <ChevronLeft
                                        size={17}
                                    />

                                    Previous

                                </button>


                                <button
                                    type="button"
                                    className="
                                        h-10
                                        min-w-10
                                        rounded-lg
                                        bg-[var(--primary)]
                                        px-3
                                        text-sm
                                        font-bold
                                        text-white
                                    "
                                >
                                    {page}
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        page === totalPages
                                    }
                                    onClick={
                                        handleNext
                                    }
                                    className="
                                        flex
                                        h-10
                                        items-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-[var(--border-color)]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-[var(--text-primary)]
                                        transition
                                        hover:bg-[var(--bg-hover)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >

                                    Next

                                    <ChevronRight
                                        size={17}
                                    />

                                </button>

                            </div>

                        </div>

                    </>

                )}

            </main>


            {/* FETCHING INDICATOR */}

            {fetching && !loading && (

                <div
                    className="
                        fixed
                        bottom-6
                        right-6
                        rounded-lg
                        border
                        border-[var(--border-color)]
                        bg-[var(--bg-card)]
                        px-4
                        py-2
                        text-sm
                        font-medium
                        shadow-lg
                        text-[var(--text-secondary)]
                    "
                >
                    Updating...
                </div>

            )}

        </div>
    );
};


export default Department;