import React, {useEffect} from "react";
import {Route, Routes, useLocation} from "react-router-dom";

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
import {useGlobalPreloader} from "./context/GlobalPreloaderProvider";
import {useAppDispatch, useAppSelector} from "./customHooks/hook";
import {useSnackbar} from "notistack";
import allActions from "./action";
import {initializeChain} from "./services/cosmos";
import {decode, encode} from "js-base64";
import {config} from "./constants/networkConfig";
import CoinGecko from "./services/coingecko";
import VotingDetails from "./component/GovernanceDetails/VotingDetails";

const menuItems = (t) => [
    {key: "dashboard", path: "/", title: t("menu.dashboard"), icon: <DashboardIcon/>},
    {key: "stake", path: "/stake", title: t("menu.stake"), icon: <StakeIcon/>},
    {key: "governance", path: "/governance", title: t("menu.governance"), icon: <GovernanceIcon/>}
];

function Main() {
    const {i18n} = useTranslation();
    const location = useLocation();
    const {activate, passivate} = useGlobalPreloader();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {
        appState: {},
        setCurrentPrice
    } = useAppState();

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem("lang") || "en");
        CoinGecko.getPrice(config.COINGECKO_ID).then((res) => {
            setCurrentPrice(res.data[config.COINGECKO_ID]["usd"])
        })
    }, []);


    const address = useAppSelector(state => state.accounts.address.value);
    const balance = useAppSelector(state => state.accounts.balance.result);
    const balanceInProgress = useAppSelector(state => state.accounts.balance.inProgress);
    const delegations = useAppSelector(state => state.accounts.delegations.result);
    const delegationsInProgress = useAppSelector(state => state.accounts.delegations.inProgress);
    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const delegatedValidatorListInProgress = useAppSelector(state => state.stake.delegatedValidators.inProgress);
    const proposals = useAppSelector(state => state.governance._.list);
    const governanceInProgress = useAppSelector(state => state.governance._.inProgress);
    const unBondingDelegations = useAppSelector(state => state.accounts.unBondingDelegations.result);
    const unBondingDelegationsInProgress = useAppSelector(state => state.accounts.unBondingDelegations.inProgress);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const validatorList = useAppSelector(state => state.stake.validators.list);
    const validatorListInProgress = useAppSelector(state => state.stake.validators.inProgress);
    const vestingBalance = useAppSelector(state => state.accounts.vestingBalance.result);
    const vestingBalanceInProgress = useAppSelector(state => state.accounts.vestingBalance.inProgress);

    useEffect(() => {
        if (!(balanceInProgress || delegationsInProgress || governanceInProgress ||
            validatorListInProgress))
            passivate();

    }, [balanceInProgress, delegationsInProgress, governanceInProgress,
        validatorListInProgress])

    useEffect(() => {
        activate();
        if (localStorage.getItem('goat_wl_addr'))
            initKeplr();

        if (address) {
            handleFetchDetails(address);
        }

        if (!validatorList.length && !validatorListInProgress) {
            dispatch(allActions.getValidators((data) => {
                if (data && data.length && validatorImages && validatorImages.length === 0) {
                    const array = data.filter((val) => val && val.description && val.description.identity);
                    getValidatorImage(0, array);
                }
            }));
        }

        if (proposals && !proposals.length && !governanceInProgress) {
            dispatch(allActions.getProposals((result) => {
                if (result && result.length) {
                    const array = [];
                    result.map((val) => {
                        if (isActivePath("/") && val.status !== 2) {
                            return null;
                        }
                        //@ts-ignore
                        array.push(val.id);
                        if (val.status === 2) {
                            dispatch(allActions.fetchProposalTally(val.id));
                        }
                        return null;
                    });
                    getProposalDetails(array && array.reverse());
                }
            }));
        }

        window.addEventListener('keplr_keystorechange', () => {
            if (localStorage.getItem('goat_wl_addr') || address !== '') {
                handleChain(true);
            }
        });
        return () => {
            window.removeEventListener('keplr_keystorechange', handleChain);
        }
    }, [])

    useEffect(() => {
        if (address) {
            handleFetchDetails(address);
        }
    }, [location])

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const initKeplr = () => {
        window.onload = () => handleChain(true);
    }

    const handleChain = (fetch) => {
        initializeChain((error, addressList) => {
            if (error) {
                enqueueSnackbar(error, {variant: "error"});
                localStorage.removeItem('goat_wl_addr');
                return;
            }

            const previousAddress = decode(localStorage.getItem('goat_wl_addr') || "");

            dispatch(allActions.setAccountAddress(addressList[0]?.address));
            if (previousAddress !== addressList[0]?.address) {
                localStorage.setItem('goat_wl_addr', encode(addressList[0]?.address));
            }
            if (fetch) {
                handleFetchDetails(addressList[0]?.address);
            }
        });
    }

    const getProposalDetails = (data) => {
        if (data && data.length && data[0]) {
            dispatch(allActions.fetchProposalDetails(data[0], () => {
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

        dispatch(allActions.fetchRewards(address));

        if (unBondingDelegations && !unBondingDelegations.length &&
            !unBondingDelegationsInProgress) {
            dispatch(allActions.getUnBondingDelegations(address));
        }
        if (delegations && !delegations.length &&
            !delegationsInProgress) {
            dispatch(allActions.getDelegations(address));
        }
        if (delegatedValidatorList && !delegatedValidatorList.length &&
            !delegatedValidatorListInProgress) {
            dispatch(allActions.getDelegatedValidatorsDetails(address));
        }
    }

    const getValidatorImage = (index, data) => {
        const array = [];
        for (let i = 0; i < 3; i++) {
            if (data[index + i]) {
                const value = data[index + i];
                let list = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
                list = JSON.parse(list);
                if (value?.description?.identity && !list[value?.description?.identity]) {
                    //@ts-ignore
                    array.push(dispatch(allActions.fetchValidatorImage(value.description.identity)));
                } else if (value?.description?.identity && list[value?.description?.identity]) {
                    dispatch(allActions.fetchValidatorImageSuccess({
                        //@ts-ignore
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
    }

    return (
        <Box sx={{display: 'flex'}}>
            <SideBar menuItems={menuItems(i18n.t)}/>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 0}}
            >
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/stake" element={<Stake/>}/>
                    <Route path="/governance" element={<Governance/>}/>
                    <Route path="/governance/:id" element={<VotingDetails/>}/>
                    <Route path="*" element={<Dashboard/>}/>
                </Routes>
            </Box>
        </Box>
    );
}

export default Main;
