import { axiosInstance } from "../../../../config/axiosInstance.jsx";


/* =====================================================
   GET DEPARTMENTS
===================================================== */

export const getDepartments = async () => {
    try {

        const res = await axiosInstance.get(
            "/departments"
        );

        console.log(
            "GET /departments response:",
            res.data
        );

        const data = res.data?.data;

        // Case 1:
        // { data: { departments: [...] } }

        if (Array.isArray(data?.departments)) {
            return data.departments;
        }

        // Case 2:
        // { data: [...] }

        if (Array.isArray(data)) {
            return data;
        }

        // Case 3:
        // { departments: [...] }

        if (
            Array.isArray(
                res.data?.departments
            )
        ) {
            return res.data.departments;
        }

        console.warn(
            "Unexpected departments response:",
            res.data
        );

        return [];

    } catch (error) {

        console.error(
            "GET /departments failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


/* =====================================================
   CREATE DEPARTMENT
===================================================== */

export const createDepartment = async (
    departmentData
) => {

    try {

        const res =
            await axiosInstance.post(
                "/departments",
                departmentData
            );

        console.log(
            "POST /departments response:",
            res.data
        );

        return (
            res.data?.data?.department ||
            res.data?.data
        );

    } catch (error) {

        console.error(
            "POST /departments failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


/* =====================================================
   UPDATE DEPARTMENT
===================================================== */

export const updateDepartment = async (
    departmentId,
    departmentData
) => {

    try {

        const res =
            await axiosInstance.put(
                `/departments/${departmentId}`,
                departmentData
            );

        console.log(
            "PUT /departments response:",
            res.data
        );

        return (
            res.data?.data?.department ||
            res.data?.data
        );

    } catch (error) {

        console.error(
            "PUT /departments failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


/* =====================================================
   DELETE DEPARTMENT
===================================================== */

export const deleteDepartment = async (
    departmentId
) => {

    try {

        const res =
            await axiosInstance.delete(
                `/departments/${departmentId}`
            );

        console.log(
            "DELETE /departments response:",
            res.data
        );

        return res.data;

    } catch (error) {

        console.error(
            "DELETE /departments failed:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};