import React, {useEffect, useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Main from "./Main";
import CustomThemeProvider from "./context/Theme/CustomThemeProvider";
import "./locales";

import {SnackbarProvider} from "notistack";
import {AppStateProvider} from "./context/AppStateContext";
import {DialogProvider} from "./context/DialogContext/DialogContext";
import GlobalPreloaderProvider, {useGlobalPreloader} from "./context/GlobalPreloaderProvider";
import {Collapse} from "@mui/material";
import Common from "./services/axios/common";

function App() {
    const [configsLoaded, setConfigStatus] = useState(false);
    const {activate, passivate} = useGlobalPreloader();

    useEffect(() => {
        Common.getConfig().then(res => {
            sessionStorage.setItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration",
                JSON.stringify(res.data));
            setConfigStatus(true);
        })
    }, [])

    useEffect(() => {
        if(!configsLoaded)
            activate();
        else
            passivate();
    },[configsLoaded])

    return (
        <Router basename={"/"}>
            <AppStateProvider>
                <CustomThemeProvider>
                    <GlobalPreloaderProvider>
                        <SnackbarProvider
                            maxSnack={5}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            dense
                            preventDuplicate
                            TransitionComponent={Collapse}
                        >
                            <DialogProvider>
                                {configsLoaded ? <Main/> : <div/>}
                            </DialogProvider>
                        </SnackbarProvider>
                    </GlobalPreloaderProvider>
                </CustomThemeProvider>
            </AppStateProvider>
        </Router>
    );
}

export default App;
