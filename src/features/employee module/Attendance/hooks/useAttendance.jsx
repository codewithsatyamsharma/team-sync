import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getTodayAttendance,
    getAttendanceHistory,
    getAttendanceSummary,
    getAttendanceCalendar,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    getMyLeaves,
    requestLeave,
} from "../api/attendanceApi.jsx";


export const useAttendance = ({
    month,
    page = 1,
    limit = 6,
}) => {

    const queryClient = useQueryClient();


    /* =====================================================
       TODAY
    ===================================================== */

    const todayQuery = useQuery({
        queryKey: [
            "attendance",
            "today",
        ],

        queryFn: getTodayAttendance,

        refetchInterval: 60000,

        staleTime: 30000,
    });


    /* =====================================================
       HISTORY
    ===================================================== */

    const historyQuery = useQuery({
        queryKey: [
            "attendance",
            "history",
            month,
            page,
            limit,
        ],

        queryFn: () =>
            getAttendanceHistory({
                month,
                page,
                limit,
            }),

        placeholderData: (previousData) =>
            previousData,

        staleTime: 30000,
    });


    /* =====================================================
       SUMMARY
    ===================================================== */

    const summaryQuery = useQuery({
        queryKey: [
            "attendance",
            "summary",
            month,
        ],

        queryFn: () =>
            getAttendanceSummary(month),

        staleTime: 60000,
    });


    /* =====================================================
       CALENDAR
    ===================================================== */

    const calendarQuery = useQuery({
        queryKey: [
            "attendance",
            "calendar",
            month,
        ],

        queryFn: () =>
            getAttendanceCalendar(month),

        staleTime: 60000,
    });


    /* =====================================================
       LEAVES
    ===================================================== */

    const leavesQuery = useQuery({
        queryKey: [
            "leaves",
            "my",
        ],

        queryFn: getMyLeaves,

        staleTime: 60000,
    });


    /* =====================================================
       COMMON INVALIDATION
    ===================================================== */

    const refreshAttendance = () => {

        queryClient.invalidateQueries({
            queryKey: [
                "attendance",
                "today",
            ],
        });

        queryClient.invalidateQueries({
            queryKey: [
                "attendance",
                "history",
            ],
        });

        queryClient.invalidateQueries({
            queryKey: [
                "attendance",
                "summary",
            ],
        });

        queryClient.invalidateQueries({
            queryKey: [
                "attendance",
                "calendar",
            ],
        });
    };


    /* =====================================================
       CHECK IN
    ===================================================== */

    const checkInMutation = useMutation({

        mutationFn: checkIn,

        onSuccess: () => {
            refreshAttendance();
        },

    });


    /* =====================================================
       CHECK OUT
    ===================================================== */

    const checkOutMutation = useMutation({

        mutationFn: checkOut,

        onSuccess: () => {
            refreshAttendance();
        },

    });


    /* =====================================================
       START BREAK
    ===================================================== */

    const startBreakMutation = useMutation({

        mutationFn: startBreak,

        onSuccess: () => {
            refreshAttendance();
        },

    });


    /* =====================================================
       END BREAK
    ===================================================== */

    const endBreakMutation = useMutation({

        mutationFn: endBreak,

        onSuccess: () => {
            refreshAttendance();
        },

    });


    /* =====================================================
       REQUEST LEAVE
    ===================================================== */

    const requestLeaveMutation = useMutation({

        mutationFn: requestLeave,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: [
                    "leaves",
                    "my",
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    "attendance",
                    "summary",
                ],
            });

        },

    });


    return {

        /* TODAY */

        today:
            todayQuery.data,

        todayLoading:
            todayQuery.isLoading,

        todayError:
            todayQuery.error,

        refetchToday:
            todayQuery.refetch,


        /* HISTORY */

        history:
            historyQuery.data,

        historyLoading:
            historyQuery.isLoading,

        historyError:
            historyQuery.error,


        /* SUMMARY */

        summary:
            summaryQuery.data,

        summaryLoading:
            summaryQuery.isLoading,

        summaryError:
            summaryQuery.error,


        /* CALENDAR */

        calendar:
            calendarQuery.data || [],

        calendarLoading:
            calendarQuery.isLoading,

        calendarError:
            calendarQuery.error,


        /* LEAVES */

        leaves:
            leavesQuery.data,

        leavesLoading:
            leavesQuery.isLoading,

        leavesError:
            leavesQuery.error,


        /* MUTATIONS */

        checkIn: checkInMutation.mutateAsync,

        checkingIn:
            checkInMutation.isPending,

        checkInError:
            checkInMutation.error,


        checkOut:
            checkOutMutation.mutateAsync,

        checkingOut:
            checkOutMutation.isPending,

        checkOutError:
            checkOutMutation.error,


        startBreak:
            startBreakMutation.mutateAsync,

        startingBreak:
            startBreakMutation.isPending,

        startBreakError:
            startBreakMutation.error,


        endBreak:
            endBreakMutation.mutateAsync,

        endingBreak:
            endBreakMutation.isPending,

        endBreakError:
            endBreakMutation.error,


        requestLeave:
            requestLeaveMutation.mutateAsync,

        requestingLeave:
            requestLeaveMutation.isPending,

        requestLeaveError:
            requestLeaveMutation.error,
    };
};