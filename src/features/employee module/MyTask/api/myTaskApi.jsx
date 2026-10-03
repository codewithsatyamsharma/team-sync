import { axiosInstance } from "../../../../config/axiosInstance.jsx";

/*
|--------------------------------------------------------------------------
| GET MY TASKS
|--------------------------------------------------------------------------
|
| Preferred backend:
|
| GET /api/tasks/my
|
| Expected response:
|
| {
|   success: true,
|   data: {
|      tasks: [...]
|   }
| }
|
*/

export const getMyTasks = async (params = {}) => {
    try {
        const response = await axiosInstance.get(
            "/tasks/my",
            {
                params,
            }
        );

        console.log(
            "GET /tasks/my response:",
            response.data
        );

        return (
            response.data?.data?.tasks ||
            response.data?.data?.task ||
            response.data?.tasks ||
            []
        );

    } catch (error) {

        console.error(
            "GET /tasks/my failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};