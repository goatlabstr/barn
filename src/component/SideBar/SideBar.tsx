import React from "react";

import {useLocation, useNavigate} from "react-router-dom";
import {Theme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {alpha, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import clsx from "clsx";

const drawerWidth = 210;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "100%"
    },
    menuListContainer: {
        marginTop: "100%"
    },
    menuSelected: {
        borderLeft: "solid 3px " + theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main
    },
    menuNoneSelected: {
        borderLeft: "solid 3px transparent"
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
            <Toolbar style={{marginBottom: 15, marginTop: 15}}>LOGO IS HERE</Toolbar>
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
                        <ListItemIcon>{data.icon}</ListItemIcon>
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
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
