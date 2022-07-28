import React from "react";

import {useLocation, useNavigate} from "react-router-dom";
import {Theme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {
    alpha, Avatar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import clsx from "clsx";
import logo from '../../logo.svg';
import {AccountBalanceWalletRounded, Email, Instagram, LogoutRounded, Telegram, Twitter} from "@mui/icons-material";
import {useGlobalPreloader} from "../../hooks/useGlobalPreloader";
import {getAllBalances, initializeChain} from "../../services/cosmos";
import {encode} from 'js-base64';
import allActions from "../../action";
import {useSnackbar} from "notistack";
import {useAppDispatch, useAppSelector} from '../../hooks/hook';
import {useAppState} from "../../hooks/useAppState";
import {CopyAddressButton} from "./CopyAddressButton";

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) => ({
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
    iconNoneSelected: {
        color: "rgb(131 157 170)"
    },
    menuListItem: {
        paddingLeft: 18,
        flexWrap: "wrap"
    },
    menuListItemText: {
        [theme.breakpoints.down("md")]: {
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
        fontSize: "24px",
        filter: "drop-shadow(2px 3px 2px rgb(0 0 0 / 0.4))"
    },
    socialMediaIcon: {
        color: "rgb(131 157 170)"
    }
}));

type SideBarProps = {
    menuItems: any,
    mobileOpen: boolean,
    handleDrawerToggle: () => void
}

export default function SideBar(props: SideBarProps) {
    const {menuItems, handleDrawerToggle, mobileOpen} = props;
    const classes = useStyles();
    const location = useLocation();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {activate, passivate} = useGlobalPreloader();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {
        appState: {
            currentPrice,
            chainInfo
        }
    } = useAppState();

    const address = useAppSelector(state => state.accounts.address.value);

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const handleDisconnectButtonClick = () => {
        localStorage.removeItem('goat_wl_addr');
        dispatch(allActions.disconnectSet());
    }

    const handleConnectButtonClick = () => {
        if (!chainInfo || Object.keys(chainInfo).length === 0)
            return;
        activate();
        initializeChain(chainInfo, (error, addressList) => {
            passivate();
            if (error) {
                localStorage.removeItem('goat_wl_addr');
                enqueueSnackbar(error, {variant: "error"});
                return;
            }
            dispatch(allActions.setAccountAddress(addressList[0]?.address));
            dispatch(allActions.getUnBondingDelegations(addressList[0] && addressList[0].address));
            dispatch(allActions.fetchRewards(addressList[0] && addressList[0].address));
            dispatch(allActions.getDelegations(addressList[0] && addressList[0].address));
            //@ts-ignore
            getAllBalances(chainInfo?.chain_id, addressList[0] && addressList[0].address, (err, data) => dispatch(allActions.getBalance(err, data)));
            dispatch(allActions.fetchVestingBalance(addressList[0] && addressList[0].address));
            dispatch(allActions.getDelegatedValidatorsDetails(addressList[0] && addressList[0].address));
            localStorage.setItem('goat_wl_addr', encode(addressList[0] && addressList[0].address));
        });
    }

    const drawer = (
        <Paper sx={{height: "100%"}}>
            <Stack direction="column" justifyContent={"space-between"} alignItems={"center"} spacing={1}
                   sx={{height: "95%"}}>
                <Toolbar style={{marginTop: 15}}>
                    <img style={{
                        width: 47,
                        marginLeft: "-15px",
                        marginRight: 17,
                        filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                    }} src={logo}/>
                    <Typography variant={"h6"} className={classes.goatlabs}>GOATLABS</Typography>
                </Toolbar>
                <List>
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
                <Stack direction="column">
                    <Stack direction="row" justifyContent="space-between" alignItems={"center"} mb={1.5}>
                        <Stack direction="row" alignItems={"center"} spacing={0.5}>
                            {//@ts-ignore
                                chainInfo?.image && <Avatar src={chainInfo?.image} sx={{width: 24, height: 24}}/>
                            }
                            <Typography variant={"body2"}>{
                                //@ts-ignore
                                chainInfo?.symbol?.toUpperCase()
                            }</Typography>
                        </Stack>
                        <Typography variant={"body2"} color={"secondary"}>${currentPrice}</Typography>
                    </Stack>
                    <CopyAddressButton address={address}/>
                    {localStorage.getItem('goat_wl_addr') || address ?
                        <Button variant="outlined"
                                sx={{"color": "rgb(131 157 170)", "borderColor": "rgb(131 157 170)"}}
                                startIcon={<LogoutRounded/>}
                                onClick={() => handleDisconnectButtonClick()}
                        >{t("menu.disconnect")}</Button> :
                        <Button variant="outlined" color="secondary"
                                startIcon={<AccountBalanceWalletRounded/>}
                                onClick={() => handleConnectButtonClick()}
                        >{t("menu.connect")}</Button>}
                    <Stack direction="row" sx={{justifyContent: "center"}}>
                        <IconButton className={classes.socialMediaIcon}
                            //@ts-ignore
                                    onClick={() => window.open("https://twitter.com/GoatlabsV", '_blank').focus()}
                                    disableRipple><Twitter/></IconButton>
                        <IconButton className={classes.socialMediaIcon}
                            //@ts-ignore
                                    onClick={() => window.open("https://www.instagram.com/goatlabsv/", '_blank').focus()}
                                    disableRipple><Instagram/></IconButton>
                        <IconButton className={classes.socialMediaIcon}
                            //@ts-ignore
                                    onClick={() => window.open("mailto:goatlabsteam@gmail.com")}
                                    disableRipple><Email/></IconButton>
                        <IconButton className={classes.socialMediaIcon}
                            //@ts-ignore
                                    onClick={() => window.open("https://t.me/goatlabs", '_blank').focus()}
                                    disableRipple><Telegram/></IconButton>
                    </Stack>
                    <Button variant="text"
                            sx={{textTransform: "none", color: "rgb(131 157 170)"}}
                            onClick={
                                () => {
                                    const coingeckoUrl =
                                        //@ts-ignore
                                        chainInfo?.coingecko_id ? "https://www.coingecko.com/coins/" + chainInfo?.coingecko_id :
                                            "https://www.coingecko.com"
                                    //@ts-ignore
                                    window.open(coingeckoUrl, '_blank').focus()
                                }
                            }

                    >
                        {t("menu.coingecko")}</Button>
                </Stack>
            </Stack>
        </Paper>
    );

    return (
        <div>
            <Box
                component="nav"
                sx={{width: {md: drawerWidth}, flexShrink: {xs: 0}}}
                aria-label="goatlabs-menu"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', md: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', md: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </div>
    );

}
