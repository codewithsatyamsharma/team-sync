import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getDashboardstats,
} from "../api/dashboardApi.jsx";


export const useDashboard = () => {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    const fetchData = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await getDashboardstats();

            console.log(
                "Dashboard data:",
                response
            );

            setData(response);

        } catch (err) {

            console.error(
                "Dashboard error:",
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


    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};