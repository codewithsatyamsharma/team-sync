import {
    useQuery,
} from "@tanstack/react-query";

import { getMyTasks } from "../api/myTaskApi.jsx";


export const useMyTask = ({
    search = "",
    priority = "",
    status = "",
} = {}) => {

    const query = useQuery({

        queryKey: [
            "myTasks",
            {
                search,
                priority,
                status,
            },
        ],

        queryFn: () =>
            getMyTasks({
                search: search || undefined,
                priority: priority || undefined,
                status: status || undefined,
            }),

        staleTime: 30 * 1000,

    });


    return {

        tasks: Array.isArray(query.data)
            ? query.data
            : [],

        loading: query.isLoading,

        fetching: query.isFetching,

        error: query.error,

        refetch: query.refetch,

        isError: query.isError,

    };
};