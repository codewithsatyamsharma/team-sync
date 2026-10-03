import { useSelector } from "react-redux";

export const useProfile = () => {
    const employee = useSelector(
        (state) => state.auth.employee
    );

    return {
        employee,
    };
};