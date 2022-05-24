import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import {useTranslation} from "react-i18next";
import {useAppState} from "./context/AppStateContext";

import SideBar from "./component/SideBar/SideBar";
import {Box} from "@mui/material";
import Stake from "./pages/Stake";
import Governance from "./pages/Governance";
import {
    AccountBalanceRounded as DashboardIcon,
    HowToVoteRounded as GovernanceIcon,
    MonetizationOnRounded as StakeIcon
} from "@mui/icons-material";

const menuItems = [
    {key: "dashboard", path: "/", title: "Dashboard", icon: <DashboardIcon/>},
    {key: "stake", path: "/stake", title: "Stake", icon: <StakeIcon/>},
    {key: "governance", path: "/governance", title: "Governance", icon: <GovernanceIcon/>}
];

function Main() {
    const {i18n} = useTranslation();
    const {
        appState: {drawerOpen}
    } = useAppState();

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem("lang") || "en");
    }, []);

    return (
        <Box sx={{display: 'flex'}}>
            <SideBar menuItems={menuItems}/>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 0}}
            >
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/stake" element={<Stake/>}/>
                    <Route path="/governance" element={<Governance/>}/>
                    <Route path="*" element={<Dashboard/>}/>
                </Routes>
            </Box>
        </Box>
    );
}

export default Main;
