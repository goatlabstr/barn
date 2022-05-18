import React, {FunctionComponent, useCallback, useEffect, useState} from "react";

import {ThemeProvider, createTheme} from "@mui/material/styles";
import {useAppState} from "../AppStateContext";
import {useTranslation} from "react-i18next";
import { create } from "jss"; // npm install jss-rtl
import rtl from "jss-rtl";// npm install jss-rtl
import {jssPreset, StylesProvider} from "@mui/styles";
import theme from "./theme";
import {CssBaseline} from "@mui/material";

type DisplayMode = 'dark' | 'light' | undefined;

const ThemeContext = React.createContext<{
    switchTheme: (value: DisplayMode) => void,
}>({
    switchTheme: (value: DisplayMode) => {
        console.log("not implemented");
    },
});

const CustomThemeProvider: FunctionComponent = ({children}) => {
    const [mode, setMode] = useState<'dark' | 'light'>("dark");
    const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
    const { i18n } = useTranslation();
    const {
        appState: {language},
        setLanguage
    } = useAppState();

    React.useLayoutEffect(() => {
        document.body.setAttribute("dir", dir );
    }, [dir]);

    const switchTheme = useCallback((value: DisplayMode) => {
        if (value !== undefined) {
            setMode(value);
        }
    }, [mode, dir]);


    useEffect(() => {
        setDir(language.startsWith('ar') ? 'rtl' : 'ltr');
        i18n.changeLanguage(language);
    }, [language]);

    // Configure JSS
    // @ts-ignore
    const jss = create({ plugins: [...jssPreset().plugins, dir === 'rtl' && rtl()] });

    return (
        <ThemeContext.Provider value={{
            switchTheme
        }}>
            <StylesProvider jss={jss}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {children}
                </ThemeProvider>
            </StylesProvider>
        </ThemeContext.Provider>
    )
}

const useThemeState = () => {
    const context = React.useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useThemeState must be used within a CustomThemeProvider");
    }

    return context;
}


export default CustomThemeProvider;
export {useThemeState};