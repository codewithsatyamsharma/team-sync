

import {axiosInstance} from "../../../config/axiosInstance.jsx";

export let getDashboardstats = async () =>{
    try {
        let res = await axiosInstance.get('/dashboard')
        return res.data.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
}