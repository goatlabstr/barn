import React, {useEffect} from "react";

import {useLocation, useNavigate} from "react-router-dom";
import {Theme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {
    alpha,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import clsx from "clsx";
import logo from '../../logo.svg';
import {AccountBalanceWalletRounded, Email, Instagram, Telegram, Twitter} from "@mui/icons-material";
import {useGlobalPreloader} from "../../context/GlobalPreloaderProvider";
import {initializeChain} from "../../services/cosmos";
import {decode, encode} from 'js-base64';
import allActions from "../../action";
import {useSnackbar} from "notistack";
import {useAppDispatch, useAppSelector} from '../../customHooks/hook';
// import config from '../../constants/networkConfig';

const drawerWidth = 220;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "100%"
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
    iconNoneSelected: {
        color: "rgb(131 157 170)"
    },
    menuListItem: {
        paddingLeft: 18,
        flexWrap: "wrap"
    },
    menuListItemText: {
        [theme.breakpoints.down("lg")]: {
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
    },
    socialMediaIcon: {
        color: "rgb(131 157 170)"
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
    const {activate, passivate} = useGlobalPreloader();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const address = useAppSelector(state => state.accounts.address.value);
    const balance = useAppSelector(state => state.accounts.balance.result);
    const balanceInProgress = useAppSelector(state => state.accounts.balance.inProgress);
    const delegations = useAppSelector(state => state.accounts.delegations.result);
    const delegationsInProgress = useAppSelector(state => state.accounts.delegations.inProgress);
    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const delegatedValidatorListInProgress = useAppSelector(state => state.stake.delegatedValidators.inProgress);
    const proposals = useAppSelector(state => state.governance._.list);
    const proposalDetails = useAppSelector(state => state.governance.proposalDetails.value);
    const governanceInProgress = useAppSelector(state => state.governance._.inProgress);
    const unBondingDelegations = useAppSelector(state => state.accounts.unBondingDelegations.result);
    const unBondingDelegationsInProgress = useAppSelector(state => state.accounts.unBondingDelegations.inProgress);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const validatorList = useAppSelector(state => state.stake.validators.list);
    const validatorListInProgress = useAppSelector(state => state.stake.validators.inProgress);
    const vestingBalance = useAppSelector(state => state.accounts.vestingBalance.result);
    const vestingBalanceInProgress = useAppSelector(state => state.accounts.vestingBalance.inProgress);
    const voteDetails = useAppSelector(state => state.governance.voteDetails.value);
    const voteDetailsInProgress = useAppSelector(state => state.governance.voteDetails.inProgress);

    useEffect(() => {
        if (localStorage.getItem('of_co_address'))
            initKeplr();

        if (proposals && !proposals.length &&
            !governanceInProgress && !isActivePath("/stake")) {
            dispatch(allActions.getProposals((result) => {
                if (result && result.length) {
                    const array = [];
                    result.map((val) => {
                        const filter = proposalDetails && Object.keys(proposalDetails).length &&
                            Object.keys(proposalDetails).find((key) => key === val.id);
                        if (!filter) {
                            if (isActivePath("/") && val.status !== 2) {
                                return null;
                            }

                            //@ts-ignore
                            array.push(val.id);
                        }
                        if (val.status === 2) {
                            dispatch(allActions.fetchProposalTally(val.id));
                        }
                        return null;
                    });
                    getProposalDetails(array && array.reverse());
                }
            }));
        }

        if (address) {
            handleFetchDetails(address);
        }

        if (!validatorList.length && !validatorListInProgress && !isActivePath("/governance")) {
            dispatch(allActions.getValidators((data) => {
                if (data && data.length && validatorImages && validatorImages.length === 0) {
                    const array = data.filter((val) => val && val.description && val.description.identity);
                    // getValidatorImage(0, array);
                }
            }));
        }

        window.addEventListener('keplr_keystorechange', () => {
            if (localStorage.getItem('of_co_address') || address !== '') {
                handleChain(false);
            }
        });

        return window.removeEventListener('keplr_keystorechange', handleChain);
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const initKeplr = () => {
        window.onload = () => handleChain(true);
    }

    const handleChain = (fetch) => {
        activate();
        initializeChain((error, addressList) => {
            passivate();
            if (error) {
                enqueueSnackbar(error, {variant: "error"});
                localStorage.removeItem('of_co_address');
                return;
            }

            const previousAddress = decode(localStorage.getItem('of_co_address') || "");

            dispatch(allActions.setAccountAddress(addressList[0]?.address));
            if (fetch) {
                handleFetchDetails(addressList[0]?.address);
            }
            if (previousAddress !== addressList[0]?.address) {
                localStorage.setItem('of_co_address', encode(addressList[0]?.address));
            }
        });
    }

    const getProposalDetails = (data) => {
        if (data && data.length && data[0]) {
            dispatch(allActions.fetchProposalDetails(data[0], (res) => {
                if (data[1]) {
                    data.splice(0, 1);
                    getProposalDetails(data);
                }
            }));
        }
    }

    const handleFetchDetails = (address) => {
        if (balance && !balance.length &&
            !balanceInProgress) {
            dispatch(allActions.getBalance(address));
        }
        if (vestingBalance && !vestingBalance.value &&
            !vestingBalanceInProgress) {
            dispatch(allActions.fetchVestingBalance(address));
        }

        if (isActivePath("/")) {
            dispatch(allActions.fetchRewards(address));
        }

        if (unBondingDelegations && !unBondingDelegations.length &&
            !unBondingDelegationsInProgress && isActivePath("/")) {
            dispatch(allActions.getUnBondingDelegations(address));
        }
        if (delegations && !delegations.length &&
            !delegationsInProgress && isActivePath("/")) {
            dispatch(allActions.getDelegations(address));
        }
        if (delegatedValidatorList && !delegatedValidatorList.length &&
            !delegatedValidatorListInProgress && isActivePath("/")) {
            dispatch(allActions.getDelegatedValidatorsDetails(address));
        }
    }

    /*const getValidatorImage = (index, data) => {
        const array = [];
        for (let i = 0; i < 3; i++) {
            if (data[index + i]) {
                const value = data[index + i];
                let list = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
                list = JSON.parse(list);
                if (value?.description?.identity && !list[value?.description?.identity]) {
                    array.push(dispatch(allActions.fetchValidatorImage(value.description.identity)));
                } else if (value?.description?.identity && list[value?.description?.identity]) {
                    dispatch(allActions.fetchValidatorImageSuccess({
                        ...list[value?.description?.identity],
                        _id: value.description.identity,
                    }));
                }
            } else {
                break;
            }
        }

        Promise.all(array).then(() => {
            if (index + 3 < data.length - 1) {
                getValidatorImage(index + 3, data);
            }
        });
    }*/

    const drawer = (
        <div className={classes.root}>
            <Stack direction="column" justifyContent={"space-between"} alignItems={"center"} spacing={1}
                   sx={{height: "95%"}}>
                <Toolbar style={{marginTop: 15}}>
                    <img style={{width: 70, marginLeft: "-15px"}} src={logo}/>
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
                    <Button variant="outlined" color="secondary"
                            startIcon={<AccountBalanceWalletRounded/>}>{t("menu.connect")}</Button>
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
                        //@ts-ignore
                            onClick={() => window.open("https://www.coingecko.com/", '_blank').focus()}

                    >
                        Price Data by Coingecko</Button>
                </Stack>
            </Stack>
        </div>
    );

    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{mr: 2, display: {lg: 'none'}, position: "absolute", left: 10, size: "large"}}
            >
                <MenuIcon fontSize="large"/>
            </IconButton>
            <Box
                component="nav"
                sx={{width: {lg: drawerWidth}, flexShrink: {lg: 0}}}
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
                        display: {xs: 'block', lg: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', lg: 'block'},
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
