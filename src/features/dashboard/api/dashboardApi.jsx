import { axiosInstance } from "../../../config/axiosInstance.jsx";

export const getDashboardstats = async () => {
    try {
        const res = await axiosInstance.get("/dashboard");

        return res.data.data;
    } catch (error) {
        console.error(
            "Error fetching dashboard stats:",
            error.response?.data || error.message
        );

        throw error;
    }
};