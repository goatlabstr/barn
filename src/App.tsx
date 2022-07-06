import React, {useEffect, useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Main from "./Main";
import CustomThemeProvider from "./context/Theme/CustomThemeProvider";
import "./locales";

import {SnackbarProvider} from "notistack";
import {AppStateProvider, useAppState} from "./context/AppStateContext";
import {DialogProvider} from "./context/DialogContext/DialogContext";
import GlobalPreloaderProvider, {useGlobalPreloader} from "./context/GlobalPreloaderProvider";
import {Collapse} from "@mui/material";
import Common from "./services/axios/common";

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
                                <Main/>
                            </DialogProvider>
                        </SnackbarProvider>
                    </GlobalPreloaderProvider>
                </CustomThemeProvider>
            </AppStateProvider>
        </Router>
    );
}

export default App;
