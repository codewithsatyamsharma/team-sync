import {
    axiosInstance,
} from "../../../../config/axiosInstance.jsx";


// ==========================================
// GET
// ==========================================

export const getTask = async (params = {}) => {

    try {

        const res =
            await axiosInstance.get(
                "/tasks",
                { params }
            );

        console.log(
            "GET /tasks response:",
            res.data
        );

        return res.data.data.tasks;

    } catch (error) {

        console.error(
            "GET /tasks failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// CREATE
// ==========================================

export const createTask = async (
    taskData
) => {

    try {

        const res =
            await axiosInstance.post(
                "/tasks",
                taskData
            );

        console.log(
            "POST /tasks response:",
            res.data
        );

        return (
            res.data?.data?.task ||
            res.data?.data
        );

    } catch (error) {

        console.error(
            "POST /tasks failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// UPDATE
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
            "Payload:",
            taskData
        );


        const res =
            await axiosInstance.patch(
                `/tasks/${taskId}`,
                taskData
            );


        console.log(
            "PATCH /tasks/:id response:",
            res.data
        );


        return (
            res.data?.data?.task ||
            res.data?.data
        );

    } catch (error) {

        console.error(
            "PATCH /tasks/:id failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// DELETE
// ==========================================

export const deleteTask = async (
    taskId
) => {

    try {

        console.log(
            "DELETE /tasks/:id",
            taskId
        );


        const res =
            await axiosInstance.delete(
                `/tasks/${taskId}`
            );


        console.log(
            "DELETE /tasks/:id response:",
            res.data
        );


        /*
         * Backend returns:
         *
         * {
         *   message: "Task deleted."
         * }
         */

        return res.data;

    } catch (error) {

        console.error(
            "DELETE /tasks/:id failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};