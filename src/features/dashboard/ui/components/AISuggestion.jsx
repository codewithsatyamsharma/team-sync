import { Sparkles } from "lucide-react";


const AISuggestion = ({
    suggestion,
}) => {

    return (
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

            <div className="flex items-center gap-2">

                <Sparkles
                    size={20}
                    className="text-[var(--primary)]"
                />

                <h2
                    className="
                        text-lg
                        font-bold
                        text-[var(--text-primary)]
                    "
                >
                    AI Suggestion
                </h2>

            </div>


            <p
                className="
                    mt-5
                    text-sm
                    font-semibold
                    text-[var(--text-primary)]
                "
            >
                AI Suggestion
            </p>


            <p
                className="
                    mt-2
                    text-sm
                    leading-6
                    text-[var(--text-secondary)]
                "
            >
                {suggestion?.message ||
                    "No suggestion available right now."}
            </p>


            <button
                type="button"
                className="
                    mt-5
                    text-sm
                    font-semibold
                    text-[var(--primary)]
                "
            >
                Take Action →
            </button>

        </section>
    );
};


export default AISuggestion;