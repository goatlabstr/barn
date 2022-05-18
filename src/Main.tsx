import React, {useEffect} from "react";
import {Route, Routes, Navigate} from "react-router-dom";

import clsx from "clsx";

import Home from "./pages/Home";
import CustomDrawer from "./component/Drawer";
import {useTranslation} from "react-i18next";
import {useAppState} from "./context/AppStateContext";

import {Assignment as ReportIcon, Ballot as TemplateIcon, GroupAdd as ApproversIcon} from "@mui/icons-material";

import {createStyles, makeStyles} from '@mui/styles';
import { Theme } from '@mui/material/styles';

const drawerItems = [
    {key: "report", path: "/report", icon: <ReportIcon/>},
    {key: "template", path: "/template", icon: <TemplateIcon/>},
//   { path: "/viewer/:reportId?", exact: true, strict: false },
    {key: "editor", path: "/editor", icon: <ApproversIcon/>}
];

const visibleDrawPathList = [
    "/report",
    "/template",
    "/"
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
        <div>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="*" element={<Home />}/>
            </Routes>
        </div>
    );
}

export default Main;
