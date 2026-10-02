import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getTask,
    createTask as createTaskApi,
    updateTask as updateTaskApi,
    deleteTask as deleteTaskApi,
} from "../apis/taskapi.jsx";


export const useTask = () => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [creating, setCreating] = useState(false);

    const [updating, setUpdating] = useState(false);

    const [deleting, setDeleting] = useState(false);


    // ==========================================
    // FETCH
    // ==========================================

    const fetchData = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await getTask();

            console.log(
                "Tasks received:",
                response
            );

            setData(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (err) {

            console.error(
                "Error fetching tasks:",
                err
            );

            setError(err);

        } finally {

            setLoading(false);

        }

    }, []);


    useEffect(() => {

        fetchData();

    }, [fetchData]);


    // ==========================================
    // CREATE
    // ==========================================

    const createNewTask = async (
        taskData
    ) => {

        try {

            setCreating(true);

            const newTask =
                await createTaskApi(taskData);


            if (newTask) {

                setData((previous) => [
                    ...previous,
                    newTask,
                ]);

            } else {

                await fetchData();

            }


            return newTask;

        } catch (err) {

            console.error(
                "Error creating task:",
                err.response?.data ||
                err.message
            );

            throw err;

        } finally {

            setCreating(false);

        }
    };


    // ==========================================
    // UPDATE
    // ==========================================

    const updateExistingTask = async (
        taskId,
        taskData
    ) => {

        try {

            setUpdating(true);

            console.log(
                "Updating task:",
                taskId
            );

            console.log(
                "Payload:",
                taskData
            );


            const updatedTask =
                await updateTaskApi(
                    taskId,
                    taskData
                );


            if (updatedTask) {

                setData((previous) =>
                    previous.map((task) =>
                        task._id === taskId
                            ? {
                                ...task,
                                ...updatedTask,
                            }
                            : task
                    )
                );

            } else {

                await fetchData();

            }


            return updatedTask;

        } catch (err) {

            console.error(
                "Error updating task:",
                err.response?.data ||
                err.message
            );

            throw err;

        } finally {

            setUpdating(false);

        }
    };


    // ==========================================
    // DELETE
    // ==========================================

    const deleteExistingTask = async (
        taskId
    ) => {

        if (!taskId) {
            return;
        }


        try {

            setDeleting(true);

            console.log(
                "Deleting task:",
                taskId
            );


            await deleteTaskApi(
                taskId
            );


            setData((previous) =>
                previous.filter(
                    (task) =>
                        task._id !== taskId
                )
            );


            console.log(
                "Task deleted successfully"
            );

        } catch (err) {

            console.error(
                "Error deleting task:",
                err.response?.data ||
                err.message
            );

            throw err;

        } finally {

            setDeleting(false);

        }
    };


    return {

        data,

        loading,

        error,

        creating,
        updating,
        deleting,

        refetch: fetchData,

        createNewTask,
        updateExistingTask,
        deleteExistingTask,
    };
};