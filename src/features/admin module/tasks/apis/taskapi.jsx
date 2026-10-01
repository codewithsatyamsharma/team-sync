import { axiosInstance } from "../../../../config/axiosInstance.jsx";


// ==========================================
// GET ALL TASKS
// ==========================================

export const getTask = async (params = {}) => {
    try {
        const res = await axiosInstance.get("/tasks", {
            params,
        });

        console.log("GET /tasks response:", res.data);

        return res.data.data.tasks;

    } catch (error) {
        console.error(
            "GET /tasks failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// CREATE TASK
// ==========================================

export const createTask = async (taskData) => {
    try {
        const res = await axiosInstance.post(
            "/tasks",
            taskData
        );

        console.log("POST /tasks response:", res.data);

        /*
         * Depending on your backend response,
         * this should normally be the created task.
         */
        return res.data.data.task;

    } catch (error) {
        console.error(
            "POST /tasks failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// UPDATE TASK
// ==========================================

export const updateTask = async (
    taskId,
    taskData
) => {
    try {

        console.log(
            "PATCH /tasks/:id",
            taskId
        );

        console.log(
            "Update payload:",
            taskData
        );

        const res = await axiosInstance.patch(
            `/tasks/${taskId}`,
            taskData
        );

        console.log(
            "PATCH /tasks/:id response:",
            res.data
        );

        /*
         * Your backend should ideally return:
         *
         * {
         *   data: {
         *      task: {...}
         *   }
         * }
         *
         * If it returns data.tasks instead,
         * change this accordingly.
         */

        return res.data.data.task;

    } catch (error) {

        console.error(
            "PATCH /tasks/:id failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// DELETE TASK
// ==========================================

export const deleteTask = async (taskId) => {
    try {

        console.log(
            "DELETE /tasks/:id",
            taskId
        );

        const res = await axiosInstance.delete(
            `/tasks/${taskId}`
        );

        console.log(
            "DELETE /tasks/:id response:",
            res.data
        );

        /*
         * Your actual backend response is:
         *
         * {
         *   message: "Task deleted."
         * }
         *
         * So DON'T access:
         *
         * res.data.data.tasks
         */

        return res.data;

    } catch (error) {

        console.error(
            "DELETE /tasks/:id failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};