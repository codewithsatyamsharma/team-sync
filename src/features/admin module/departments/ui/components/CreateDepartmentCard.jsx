import React from "react";
import { Plus } from "lucide-react";


const CreateDepartmentCard = ({
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className="
                flex
                min-h-[260px]
                w-full
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-[var(--border-color)]
                bg-transparent
                transition-all
                duration-200
                hover:border-[var(--primary)]
                hover:bg-[var(--bg-hover)]
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border-color)]
                    text-[var(--text-secondary)]
                "
            >

                <Plus size={25} />

            </div>


            <p
                className="
                    mt-5
                    text-base
                    font-bold
                    text-[var(--text-primary)]
                "
            >
                Create New Unit
            </p>


            <p
                className="
                    mt-1
                    text-sm
                    text-[var(--text-secondary)]
                "
            >
                Add a department to your org
            </p>

        </button>
    );
};


export default CreateDepartmentCard;