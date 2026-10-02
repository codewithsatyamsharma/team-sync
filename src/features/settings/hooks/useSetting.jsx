import { useSelector } from "react-redux";

export const useSetting = () => {
    const employee = useSelector(
        (state) => state.auth.employee
    );

    

    let theme = useSelector((state) => state.theme.mode);

    return {
        employee,
        theme,
    };
};