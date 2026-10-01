import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  X,
  Loader2,
} from "lucide-react";


const EditTaskModal = ({
  task,
  open,
  onClose,
  onUpdate,
  loading = false,
}) => {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm();


  useEffect(() => {

    if (task) {

      reset({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        department: task.department || "engineering",
        dueDate: task.dueDate
          ? task.dueDate.substring(0, 10)
          : "",
        status: task.status || "todo",
        progress: task.progress || 0,
      });

    }

  }, [task, reset]);


  if (!open || !task) {
    return null;
  }


  const submitHandler = async (formData) => {

    await onUpdate(
      task._id,
      {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        department: formData.department,
        dueDate: formData.dueDate || undefined,
        status: formData.status,
        progress: Number(formData.progress || 0),
      }
    );
  };


  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-[500px]
          rounded-lg
          border
          border-[var(--border-color)]
          bg-[var(--bg-surface)]
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--border-color)]
            px-4
            py-3
          "
        >

          <div>
            <h2 className="text-[13px] font-semibold">
              Edit Task
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                text-[var(--text-muted)]
              "
            >
              Update task information
            </p>
          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              rounded
              p-1
              text-[var(--text-muted)]
              hover:bg-[var(--bg-hover)]
            "
          >
            <X size={15} />
          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-4 p-4"
        >

          {/* TITLE */}

          <div>

            <label
              className="
                mb-1
                block
                text-[9px]
                font-semibold
                uppercase
                text-[var(--text-secondary)]
              "
            >
              Task Title
            </label>

            <input
              {...register("title", {
                required: true,
              })}
              className="
                h-9
                w-full
                rounded-md
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                px-3
                text-[10px]
                text-[var(--text-primary)]
                outline-none
                focus:border-[var(--accent)]
              "
            />

          </div>


          {/* DESCRIPTION */}

          <div>

            <label
              className="
                mb-1
                block
                text-[9px]
                font-semibold
                uppercase
                text-[var(--text-secondary)]
              "
            >
              Description
            </label>

            <textarea
              {...register("description")}
              rows={4}
              className="
                w-full
                resize-none
                rounded-md
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                p-3
                text-[10px]
                text-[var(--text-primary)]
                outline-none
                focus:border-[var(--accent)]
              "
            />

          </div>


          {/* STATUS + PRIORITY */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  text-[var(--text-secondary)]
                "
              >
                Status
              </label>

              <select
                {...register("status")}
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-card)]
                  px-2
                  text-[10px]
                  text-[var(--text-primary)]
                  outline-none
                "
              >
                <option value="todo">
                  Todo
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>

            </div>


            <div>

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  text-[var(--text-secondary)]
                "
              >
                Priority
              </label>

              <select
                {...register("priority")}
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-card)]
                  px-2
                  text-[10px]
                  text-[var(--text-primary)]
                  outline-none
                "
              >
                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>
              </select>

            </div>

          </div>


          {/* DEPARTMENT + DATE */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  text-[var(--text-secondary)]
                "
              >
                Department
              </label>

              <select
                {...register("department")}
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-card)]
                  px-2
                  text-[10px]
                  text-[var(--text-primary)]
                  outline-none
                "
              >
                <option value="engineering">
                  Engineering
                </option>

                <option value="design">
                  Design
                </option>

                <option value="marketing">
                  Marketing
                </option>

                <option value="operations">
                  Operations
                </option>
              </select>

            </div>


            <div>

              <label
                className="
                  mb-1
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  text-[var(--text-secondary)]
                "
              >
                Due Date
              </label>

              <input
                {...register("dueDate")}
                type="date"
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-[var(--border-color)]
                  bg-[var(--bg-card)]
                  px-2
                  text-[10px]
                  text-[var(--text-primary)]
                  outline-none
                "
              />

            </div>

          </div>


          {/* PROGRESS */}

          <div>

            <label
              className="
                mb-1
                block
                text-[9px]
                font-semibold
                uppercase
                text-[var(--text-secondary)]
              "
            >
              Progress
            </label>

            <input
              {...register("progress")}
              type="number"
              min="0"
              max="100"
              className="
                h-9
                w-full
                rounded-md
                border
                border-[var(--border-color)]
                bg-[var(--bg-card)]
                px-3
                text-[10px]
                text-[var(--text-primary)]
                outline-none
              "
            />

          </div>


          {/* FOOTER */}

          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-[var(--border-color)]
              pt-4
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-md
                px-3
                py-2
                text-[10px]
                text-[var(--text-secondary)]
                hover:bg-[var(--bg-hover)]
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                rounded-md
                bg-[var(--accent)]
                px-4
                py-2
                text-[10px]
                font-semibold
                text-white
                disabled:opacity-50
              "
            >

              {loading && (
                <Loader2
                  size={12}
                  className="animate-spin"
                />
              )}

              {loading
                ? "Updating..."
                : "Update Task"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default EditTaskModal;