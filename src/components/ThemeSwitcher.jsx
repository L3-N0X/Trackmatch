import React from "react";
import useDarkMode from "use-dark-mode";
import { Button } from "@nextui-org/react";

export const ThemeSwitcher = () => {
    const darkMode = useDarkMode(false);

    return (
        <div className="flex gap-2">
            <Button color="primary" onClick={darkMode.disable}>Light Mode</Button>
            <Button color="primary" onClick={darkMode.enable}>Dark Mode</Button>
        </div>
    )
};