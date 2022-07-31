import React, {useEffect, useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Main from "./Main";
import CustomThemeProvider from "./hooks/use-theme/CustomThemeProvider";
import "./locales";

import {SnackbarProvider} from "notistack";
import {AppStateProvider, useAppState} from "./hooks/useAppState";
import {DialogProvider} from "./hooks/use-dialog/DialogContext";
import GlobalPreloaderProvider, {useGlobalPreloader} from "./hooks/useGlobalPreloader";
import {Collapse} from "@mui/material";
import Common from "./services/axios/common";
import {GetKeplrProvider} from "./hooks/use-keplr/context";

function App() {
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
                                <GetKeplrProvider>
                                    <Main/>
                                </GetKeplrProvider>
                            </DialogProvider>
                        </SnackbarProvider>
                    </GlobalPreloaderProvider>
                </CustomThemeProvider>
            </AppStateProvider>
        </Router>
    );
}

export default App;
