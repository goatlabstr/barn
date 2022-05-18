import React from "react";

import {useLocation, useNavigate} from "react-router-dom";
import {Theme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {alpha, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography} from "@mui/material";
import clsx from "clsx";
import logo from '../../logo.svg';

const drawerWidth = 210;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "100%"
    },
    menuListContainer: {
        marginTop: "100%"
    },
    menuSelected: {
        borderLeft: "solid 0px " + theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    menuNoneSelected: {
        borderLeft: "solid 0px transparent",
        color: "rgb(131 157 170)"
    },
    iconSelected: {
        color: theme.palette.secondary.main
    },
    iconNoneSelected:{
        color: "rgb(131 157 170)"
    },
    menuListItem: {
        paddingLeft: 25,
        flexWrap: "wrap"
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
    goatlabs: {
        marginLeft: "-10px",
        marginTop: "2px",
        fontSize: "21px"
    }
}));

type SideBarProps = {
    menuItems: any
}

export default function SideBar(props: SideBarProps) {
    const {menuItems} = props;
    const classes = useStyles();
    const location = useLocation();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const drawer = (
        <div className={classes.root}>
            <Toolbar style={{marginBottom: 15, marginTop: 15}}>
                <img style={{width: 70, marginLeft: "-15px"}} src={logo}/>
                <Typography variant={"h6"} className={classes.goatlabs}>GOATLABS</Typography>
            </Toolbar>
            <List className={classes.menuListContainer}>
                {menuItems.map((data, index) => (
                    <ListItem
                        button
                        key={data.key}
                        className={clsx(classes.menuListItem, {
                            [classes.menuSelected]: isActivePath(data.path),
                            [classes.menuNoneSelected]: !isActivePath(data.path)
                        })}
                        onClick={() => navigate(data.path)}
                    >
                        <ListItemIcon
                            className={clsx({
                                [classes.iconSelected]: isActivePath(data.path),
                                [classes.iconNoneSelected]: !isActivePath(data.path)
                            })}
                        >{data.icon}</ListItemIcon>
                        <ListItemText className={classes.menuListItemText} primary={data.title}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <>
            {/*<Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{mr: 2, display: {sm: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>
            </Toolbar>*/}
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );

}
