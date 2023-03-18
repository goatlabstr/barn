import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Main from "./Main";
import CustomThemeProvider from "./hooks/use-theme/CustomThemeProvider";
import "./locales";

import {SnackbarProvider} from "notistack";
import {AppStateProvider} from "./hooks/useAppState";
import {DialogProvider} from "./hooks/use-dialog/DialogContext";
import GlobalPreloaderProvider from "./hooks/useGlobalPreloader";
import {Collapse} from "@mui/material";
import {GetKeplrProvider} from "./hooks/use-keplr/context";
import {networkName} from "./constants/networkConfig";

function App() {
    return (
        <Router basename={"/" + networkName}>
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
                            <GetKeplrProvider>
                                <DialogProvider>
                                    <Main/>
                                </DialogProvider>
                            </GetKeplrProvider>
                        </SnackbarProvider>
                    </GlobalPreloaderProvider>
                </CustomThemeProvider>
            </AppStateProvider>
        </Router>
    );
}

export default App;
