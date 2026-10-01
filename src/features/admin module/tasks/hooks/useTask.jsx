import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import {
    getTask,
    createTask as createTaskApi,
    updateTask as updateTaskApi,
    deleteTask as deleteTaskApi,
} from "../apis/taskapi.jsx";


export const useTask = () => {

    const queryClient = useQueryClient();

    const taskQuery = useQuery({
        queryKey: ["tasks"],
        queryFn: getTask,
        staleTime: 5 * 60 * 1000, 
    })

    const createTaskMutation = useMutation({
        mutationFn: createTaskApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ taskId, taskData }) => updateTaskApi(taskId, taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const deleteTaskMutation = useMutation({   
        mutationFn: (taskId) => deleteTaskApi(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const fetchData = async () => {
        await taskQuery.refetch();
    };

    const createNewTask = async (taskData) => {
        await createTaskMutation.mutateAsync(taskData);
    };

    const updateExistingTask = async (taskId, taskData) => {
        await updateTaskMutation.mutateAsync({ taskId, taskData });
    };

    const deleteExistingTask = async (taskId) => {
        await deleteTaskMutation.mutateAsync(taskId);
    };

    const data = taskQuery.data || [];
    const loading = taskQuery.isLoading;
    const error = taskQuery.error;

    const creating = createTaskMutation.isLoading;
    const updating = updateTaskMutation.isLoading;
    const deleting = deleteTaskMutation.isLoading;  

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