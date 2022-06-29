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
    const [configReady, setConfigReady] = useState<boolean>(false);
    const {activate, passivate} = useGlobalPreloader();

    useEffect(() => {
        if (sessionStorage.getItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration") === null) {
            activate();
            Common.getConfig().then(res => {
                sessionStorage.setItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration",
                    JSON.stringify(res.data));
                setConfigReady(true);
                passivate();
            });
        } else
            setConfigReady(true);
    }, []);

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
                            {configReady ? <DialogProvider>
                                <Main/>
                            </DialogProvider> : <div/>}
                        </SnackbarProvider>
                    </GlobalPreloaderProvider>
                </CustomThemeProvider>
            </AppStateProvider>
        </Router>
    );
}

export default App;
