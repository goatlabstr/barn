import React, {ReactComponentElement} from "react";
import {matchPath, useNavigate, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

import {alpha, Theme} from '@mui/material/styles';
import {createStyles, makeStyles} from "@mui/styles";

import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";

import clsx from "clsx";

const drawerOpenWidth = 230;
const drawerCloseWidth = 100;

const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            drawer: {
                flexShrink: 0,
                whiteSpace: "nowrap",
                overflowX: "hidden",
                [theme.breakpoints.up("sm")]: {
                    width: drawerOpenWidth,
                },
                [theme.breakpoints.down("sm")]: {
                    width: drawerCloseWidth,
                }
            },
            drawerOpen: {
                width: drawerOpenWidth,
                overflowX: "hidden",
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
            drawerClose: {
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: "hidden",
                width: drawerCloseWidth
            },
            listIcon: {
                [theme.breakpoints.up("sm")]: {
                    display: "none",
                },
                [theme.breakpoints.down("sm")]: {
                    justifyContent: "center",
                    display: "inherit",
                }
            },
            toolbar: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: theme.spacing(0, 1),
                // necessary for content to be below app bar
                ...theme.mixins.toolbar,
            },
            menuListItemText: {
                [theme.breakpoints.down("sm")]: {
                    "& .MuiTypography-body1": {
                        width: 80,
                        fontSize: "0.7rem",
                        display: "inline-block",
                        maxHeight: "1.4rem",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        fontWeight: 400,
                        lineHeight: "1.4rem",
                        textOverflow: "ellipsis"
                    }
                }
            },
            menuListItem: {
                paddingLeft: 5,
                flexFlow: "column",
                flexWrap: "wrap"
            },
            menuListOpen: {},
            menuListClose: {
                height: "72px",
            },
            menuSelected: {
                borderLeft: "solid 3px " + theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fill: theme.palette.primary.main
            },
            menuNoneSelected: {
                borderLeft: "solid 3px transparent"
            }
        })
    )
;

type DrawerItemsType = {
    key: string
    path: string
    icon: ReactComponentElement<any>
};

type DrawerPropTypes = {
    open?: boolean;
    drawerItems: DrawerItemsType[];
    visibleDrawPathList: string[];
};

type DrawerContentPropTypes = {
    open?: boolean;
    drawerItems: DrawerItemsType[];
};

const DrawerContent = ({open, drawerItems}: DrawerContentPropTypes) => {
    const classes = useStyles();
    const location = useLocation();
    const {t} = useTranslation();
    let navigate = useNavigate();

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }
    return (<>
        <Divider/>
        <List>
            {drawerItems.map((item) =>
                <ListItem
                    button
                    key={item.key}
                    className={clsx(classes.menuListItem, {
                        [classes.menuListOpen]: open,
                        [classes.menuListClose]: !open,
                        [classes.menuSelected]: isActivePath(item.path),
                        [classes.menuNoneSelected]: !isActivePath(item.path)
                    })}
                    onClick={() => navigate(item.path)}
                >
                    <ListItemIcon className={classes.listIcon}>
                        <Tooltip placement="right-end" title={t(item.key) || ""}>
                            {item.icon}
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText className={classes.menuListItemText} primary={t(item.key)}/>
                </ListItem>
            )}
        </List>
    </>)
}

const CustomDrawer = ({
                          open = true,
                          drawerItems,
                          visibleDrawPathList,
                      }: DrawerPropTypes) => {
    const classes = useStyles();
    const location = useLocation();

    const isVisible = () => {
        if (visibleDrawPathList === undefined) return true;
        else if (typeof visibleDrawPathList === "object") {
            return visibleDrawPathList.includes(location.pathname)
        }
        return false;
    };

    return (
        <Drawer
            style={{display: isVisible() ? "inherit" : "none"}}
            className={classes.drawer}
            classes={{
                paper: classes.drawer,
            }}
            variant="permanent"
        >
            <DrawerContent open drawerItems={drawerItems}/>
        </Drawer>
    );
}

export default React.memo(CustomDrawer);
