import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
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
import SupportedNetworks from "./pages/SupportedNetworks";
import ResponsiveAppBar from "./component/Menu/AppBar/ResponsiveAppBar";

function App() {
    return (
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
                                <Router>
                                    <Routes>
                                        <Route path="/" element={
                                            <div>
                                                <ResponsiveAppBar/>
                                                <SupportedNetworks/>
                                            </div>
                                        }/>
                                    </Routes>
                                </Router>
                                <Router basename={"/" + networkName}>
                                    <Main/>
                                </Router>
                            </DialogProvider>
                        </GetKeplrProvider>
                    </SnackbarProvider>
                </GlobalPreloaderProvider>
            </CustomThemeProvider>
        </AppStateProvider>
    );
}

export default App;
