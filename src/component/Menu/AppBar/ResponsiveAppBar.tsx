import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logo from "../../../logo.svg";
import {AccountBalanceWalletRounded, LogoutRounded} from "@mui/icons-material";
import {initializeChain} from "../../../services/cosmos";
import {kvStorePrefix, localStorageClearWithPrefix} from "../../../constants/general";
import allActions from "../../../action";
import {encode} from "js-base64";
import {useAppDispatch, useAppSelector} from "../../../hooks/hook";
import {useTranslation} from "react-i18next";
import {useGlobalPreloader} from "../../../hooks/useGlobalPreloader";
import {useSnackbar} from "notistack";
import {useAppState} from "../../../hooks/useAppState";
import {useKeplr} from "../../../hooks/use-keplr/hook";
import NetworkSelect from "./NetworkSelect";
import {Grid, IconButton, Stack} from "@mui/material";
import {networkName} from "../../../constants/networkConfig";
import clsx from "clsx";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {useLocation, useNavigate} from "react-router-dom";


const useStyles = makeStyles((theme: Theme) => ({
    menuSelected: {
        borderLeft: "solid 0px " + theme.palette.secondary.main,
        color: theme.palette.secondary.main
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
    socialMediaIcon: {
        color: "rgb(131 157 170)"
    }
}));

function ResponsiveAppBar({menuItems = []}: { menuItems?: Array<any> }) {
    const navigate = useNavigate();
    const classes = useStyles();
    const {activate, passivate} = useGlobalPreloader();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {enqueueSnackbar} = useSnackbar();
    const {t} = useTranslation();
    const {
        appState: {
            chainInfo
        },
    } = useAppState();
    const {getKeplr, connectionType, clearLastUsedKeplr} = useKeplr();

    const address = useAppSelector(state => state.accounts.address.value);

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const handleDisconnectButtonClick = () => {
        localStorage.clear();
        clearLastUsedKeplr();
        dispatch(allActions.disconnectSet());
    }

    const handleConnectButtonClick = () => {
        if (!chainInfo || Object.keys(chainInfo).length === 0)
            return;
        activate();
        localStorage.setItem("auto_connect_active", "true");
        getKeplr().then(keplr => {
            initializeChain(chainInfo, keplr, connectionType, (error, addressList) => {
                passivate();
                if (error) {
                    localStorage.removeItem("auto_connect_active");
                    localStorage.removeItem("connection_type");
                    localStorage.removeItem("goat_wl_addr");
                    localStorage.removeItem("walletconnect");
                    localStorageClearWithPrefix(kvStorePrefix);
                    enqueueSnackbar(error, {variant: "error"});
                    return;
                }
                dispatch(allActions.setAccountAddress(addressList[0]?.address));
                dispatch(allActions.getUnBondingDelegations(addressList[0] && addressList[0].address));
                dispatch(allActions.fetchRewards(addressList[0] && addressList[0].address));
                dispatch(allActions.getDelegations(addressList[0] && addressList[0].address));
                //@ts-ignore
                // getAllBalances(keplr, chainInfo?.chain_id, address, (err, data) => dispatch(allActions.getBalance(err, data)));
                dispatch(allActions.getAllBalance(address));
                dispatch(allActions.fetchVestingBalance(addressList[0] && addressList[0].address));
                dispatch(allActions.getDelegatedValidatorsDetails(addressList[0] && addressList[0].address));
                localStorage.setItem('goat_wl_addr', encode(addressList[0] && addressList[0].address));
            });
        })
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Stack direction="row" alignItems="center"
                           sx={{display: {xs: 'none', md: 'flex'}, ml: networkName ? "auto" : "calc(50% - 165px)"}}>
                        {!networkName && <Box
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            GOATLABS
                        </Box>}
                        <Box sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}>
                            <img style={{
                                width: 42,
                                filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                            }} src={logo}/>
                        </Box>
                        {!networkName && <Box
                            component="a"
                            href="/"
                            sx={{
                                ml: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            VALIDATOR
                        </Box>}
                    </Stack>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Stack direction={"row"}>
                            {menuItems.map((item) => (
                                <Stack direction={"row"} alignItems={"center"}
                                       spacing={0.8}
                                       sx={{ml: 2, cursor: "pointer"}}>
                                    <Box
                                        className={clsx({
                                            [classes.iconSelected]: isActivePath(item.path),
                                            [classes.iconNoneSelected]: !isActivePath(item.path)
                                        })}
                                    >{item.icon}</Box>
                                    <Box
                                        key={item?.key}
                                        className={clsx({
                                            [classes.menuSelected]: isActivePath(item?.path),
                                            [classes.menuNoneSelected]: !isActivePath(item?.path)
                                        })}
                                        onClick={() => navigate(item?.path)}
                                        sx={{pr: 1, display: 'block', fontSize: 15}}
                                    >
                                        {item?.title}
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                    <Stack direction="row" sx={{display: {xs: 'none', md: 'flex'}}}>
                        <Box sx={{mr: 1}}>
                            {networkName ? <NetworkSelect/> : <></>}
                        </Box>
                        {networkName ? (!(localStorage.getItem('goat_wl_addr') || address) ?
                            <Button variant="outlined" color="secondary"
                                    startIcon={<AccountBalanceWalletRounded/>}
                                    onClick={() => handleConnectButtonClick()}
                            >{t("menu.connect")}</Button> :
                            <Button variant="outlined"
                                    sx={{"color": "rgb(131 157 170)", "borderColor": "rgb(131 157 170)"}}
                                    startIcon={<LogoutRounded/>}
                                    onClick={() => handleDisconnectButtonClick()}
                            >{t("menu.disconnect")}</Button>) : <></>}
                    </Stack>

                    <Grid container
                          direction={"row"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          sx={{display: {xs: 'flex', md: 'none'}}}>
                        <Grid item xs={4} sx={{textAlign: "start"}}>
                            <Box>
                                {networkName ? <NetworkSelect type={"small"}/> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign: "center"}}>
                            <Box>
                                <img style={{
                                    width: 40,
                                    filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                                }} src={logo}/>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign: "end"}}>
                            {networkName ? (!(localStorage.getItem('goat_wl_addr') || address) ?
                                <Button color="secondary"
                                        startIcon={<AccountBalanceWalletRounded/>}
                                        onClick={() => handleConnectButtonClick()}
                                >
                                    Connect
                                </Button> :
                                <IconButton sx={{"color": "rgb(131 157 170)", "borderColor": "rgb(131 157 170)"}}
                                            onClick={() => handleDisconnectButtonClick()}
                                >
                                    <LogoutRounded/>
                                </IconButton>) : <></>}
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;

