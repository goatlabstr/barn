import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Main from "./Main";
import CustomThemeProvider from "./context/Theme/CustomThemeProvider";
import "./locales";

import {SnackbarProvider} from "notistack";
import {AppStateProvider} from "./context/AppStateContext";
import {DialogProvider} from "./context/DialogContext/DialogContext";
import GlobalPreloaderProvider from "./context/GlobalPreloaderProvider";
import {Collapse} from "@mui/material";

function App() {
    return (<>
        {
            sessionStorage.getItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration") ?
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
                </Router> : <div/>
        }
    </>);
}

export default App;
