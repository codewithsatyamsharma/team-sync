import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {

    const theme = useSelector(
        (state) => state.theme.mode
    );

    useEffect(() => {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

    }, [theme]);

    return children;
};

export default ThemeProvider;