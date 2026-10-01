import {
  WandSparkles,
  ArrowRight,
} from "lucide-react";


const AISuggestion = ({ suggestion }) => {

  const message = suggestion?.message;


  return (
    <section
      className="
        min-h-[165px]
        rounded-[var(--radius-md)]
        border
        border-[var(--border-color)]
        bg-[var(--bg-card-secondary)]
        p-4
        shadow-[var(--shadow-md)]
        transition-colors
        duration-300
      "
    >

      {/* ICON */}

      <div className="flex items-center gap-2">

        <WandSparkles
          size={18}
          className="text-[var(--accent)]"
          strokeWidth={1.6}
        />

        <span
          className="
            text-base
            font-semibold
            text-[var(--text-primary)]
          "
        >
          AI
        </span>

      </div>


      {/* TITLE */}

      <h3
        className="
          mt-3
          text-[14px]
          font-semibold
          text-[var(--text-primary)]
        "
      >
        AI Suggestion
      </h3>


      {/* MESSAGE */}

      <p
        className="
          mt-1.5
          text-[10px]
          leading-[1.5]
          text-[var(--text-secondary)]
        "
      >
        {message || "No suggestions available right now."}
      </p>


      {/* ACTION */}

      {message && (
        <button
          className="
            mt-4
            flex
            items-center
            gap-1
            text-[10px]
            font-semibold
            text-[var(--accent)]
            transition
            hover:opacity-75
          "
        >
          Take Action

          <ArrowRight size={11} />
        </button>
      )}

    </section>
  );
};


export default AISuggestion;