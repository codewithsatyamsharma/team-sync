import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../api/departmentApi.jsx";


export const useDepartment = () => {

    const queryClient = useQueryClient();


    // =========================================
    // GET DEPARTMENTS
    // =========================================

    const departmentsQuery = useQuery({
        queryKey: ["departments"],
        queryFn: () => getDepartments(),
    });


    // =========================================
    // GET SINGLE DEPARTMENT
    // =========================================

    const getSingleDepartment = (departmentId) => {

        return useQuery({
            queryKey: ["department", departmentId],

            queryFn: () =>
                getDepartment(departmentId),

            enabled: Boolean(departmentId),
        });

    };


    // =========================================
    // CREATE
    // =========================================

    const createMutation = useMutation({

        mutationFn: createDepartment,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

        },

    });


    // =========================================
    // UPDATE
    // =========================================

    const updateMutation = useMutation({

        mutationFn: ({
            departmentId,
            departmentData,
        }) =>
            updateDepartment(
                departmentId,
                departmentData
            ),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "department",
                    variables.departmentId,
                ],
            });

        },

    });


    // =========================================
    // DELETE
    // =========================================

    const deleteMutation = useMutation({

        mutationFn: deleteDepartment,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

        },

    });


    return {

        // -------------------------
        // DATA
        // -------------------------

        departments:
            departmentsQuery.data || [],

        // -------------------------
        // FETCH
        // -------------------------

        loading:
            departmentsQuery.isLoading,

        fetching:
            departmentsQuery.isFetching,

        error:
            departmentsQuery.error,

        refetch:
            departmentsQuery.refetch,

        // -------------------------
        // CREATE
        // -------------------------

        createDepartment:
            createMutation.mutateAsync,

        creating:
            createMutation.isPending,

        createError:
            createMutation.error,

        // -------------------------
        // UPDATE
        // -------------------------

        updateDepartment:
            updateMutation.mutateAsync,

        updating:
            updateMutation.isPending,

        updateError:
            updateMutation.error,

        // -------------------------
        // DELETE
        // -------------------------

        deleteDepartment:
            deleteMutation.mutateAsync,

        deleting:
            deleteMutation.isPending,

        deleteError:
            deleteMutation.error,

        // -------------------------
        // SINGLE
        // -------------------------

        getSingleDepartment,
    };
};