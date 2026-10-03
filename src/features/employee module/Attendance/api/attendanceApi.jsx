import { axiosInstance } from "../../../../config/axiosInstance.jsx";

/* =========================================================
   TODAY
========================================================= */

export const getTodayAttendance = async () => {
    const res = await axiosInstance.get(
        "/attendance/today"
    );

    return res.data.data;
};


/* =========================================================
   ATTENDANCE HISTORY
========================================================= */

export const getAttendanceHistory = async (params = {}) => {
    const res = await axiosInstance.get(
        "/attendance",
        {
            params,
        }
    );

    return res.data.data;
};


/* =========================================================
   SUMMARY
========================================================= */

export const getAttendanceSummary = async (month) => {
    const res = await axiosInstance.get(
        "/attendance/summary",
        {
            params: {
                month,
            },
        }
    );

    return res.data.data;
};


/* =========================================================
   CALENDAR
========================================================= */

export const getAttendanceCalendar = async (month) => {
    const res = await axiosInstance.get(
        "/attendance/calendar",
        {
            params: {
                month,
            },
        }
    );

    return res.data.data;
};


/* =========================================================
   CHECK IN
========================================================= */

export const checkIn = async (mode) => {
    const res = await axiosInstance.post(
        "/attendance/check-in",
        {
            mode,
        }
    );

    return res.data.data;
};


/* =========================================================
   CHECK OUT
========================================================= */

export const checkOut = async () => {
    const res = await axiosInstance.post(
        "/attendance/check-out"
    );

    return res.data.data;
};


/* =========================================================
   START BREAK
========================================================= */

export const startBreak = async () => {
    const res = await axiosInstance.post(
        "/attendance/break/start"
    );

    return res.data.data;
};


/* =========================================================
   END BREAK
========================================================= */

export const endBreak = async () => {
    const res = await axiosInstance.post(
        "/attendance/break/end"
    );

    return res.data.data;
};


/* =========================================================
   MY LEAVES
========================================================= */

export const getMyLeaves = async () => {
    const res = await axiosInstance.get(
        "/leaves/my"
    );

    return res.data.data;
};


/* =========================================================
   REQUEST LEAVE
========================================================= */

export const requestLeave = async (leaveData) => {
    const res = await axiosInstance.post(
        "/leaves",
        leaveData
    );

    return res.data.data;
};