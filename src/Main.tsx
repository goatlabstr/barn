import React, {useEffect, useState} from "react";
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
    MonetizationOnRounded as StakeIcon,
    Flare as NetworksIcon
} from "@mui/icons-material";
import {useGlobalPreloader} from "./context/GlobalPreloaderProvider";
import {useAppDispatch, useAppSelector} from "./customHooks/hook";
import {useSnackbar} from "notistack";
import allActions from "./action";
import {getAllBalances, initializeChain} from "./services/cosmos";
import {decode, encode} from "js-base64";
import CoinGecko from "./services/axios/coingecko";
import VotingDetails from "./component/GovernanceDetails/VotingDetails";
import Common from "./services/axios/common";
import SupportedNetworks from "./pages/SupportedNetworks";

const menuItems = (t) => [
    {key: "dashboard", path: "/", title: t("menu.dashboard"), icon: <DashboardIcon/>},
    {key: "stake", path: "/stake", title: t("menu.stake"), icon: <StakeIcon/>},
    {key: "governance", path: "/governance", title: t("menu.governance"), icon: <GovernanceIcon/>},
    {key: "networks", path: "/networks", title: t("menu.networks"), icon: <NetworksIcon/>}
];

function Main() {
    const {i18n} = useTranslation();
    const location = useLocation();
    const {activate, passivate} = useGlobalPreloader();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const {
        appState: {
            chains
        },
        setCurrentPrice,
        setChains,
        setActiveValidators,
        setInactiveValidators
    } = useAppState();

    useEffect(() => {
        activate();
        Common.getChainsInfo().then((res) => {
            setChains(res?.data?.chain);
            Common.getValidatorsInfo().then((response) => {
                const validatorsResponse = response?.data?.validators;
                if (validatorsResponse) {
                    const activeValidators = validatorsResponse.filter((valid) => valid?.status === "BOND_STATUS_BONDED");
                    const inactiveValidators = validatorsResponse.filter((valid) => !(valid?.status === "BOND_STATUS_BONDED"));
                    setActiveValidators(activeValidators);
                    setInactiveValidators(inactiveValidators);
                    window.addEventListener('keplr_keystorechange', () => {
                        if (localStorage.getItem('goat_wl_addr') || address !== '') {
                            handleChain(res?.data?.chain, true);
                        }
                    });
                }
                passivate();
            })
        });
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
    const vestingBalance = useAppSelector(state => state.accounts.vestingBalance.result);
    const vestingBalanceInProgress = useAppSelector(state => state.accounts.vestingBalance.inProgress);

    useEffect(() => {
        if (!(balanceInProgress || delegationsInProgress || governanceInProgress))
            passivate();

    }, [balanceInProgress, delegationsInProgress, governanceInProgress])

    useEffect(() => {
        activate();
        if (chains && Object.keys(chains).length > 0 && localStorage.getItem('goat_wl_addr'))
            initKeplr();

        if (address && chains && Object.keys(chains).length > 0) {
            handleFetchDetails(address);
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
    }, [chains])

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem("lang") || "en");
        //@ts-ignore
        const coingeckoId = chains?.coingecko_id;
        if (coingeckoId) {
            CoinGecko.getPrice(coingeckoId).then((res) => {
                setCurrentPrice(res.data[coingeckoId]["usd"])
            })
        } else {
            setCurrentPrice(0)
        }
    }, [chains]);

    useEffect(() => {
        if (address && chains && Object.keys(chains).length > 0) {
            handleFetchDetails(address);
        }
    }, [location, chains])

    const isActivePath = (pathname) => {
        return location.pathname === pathname;
    }

    const initKeplr = () => {
        handleChain(chains, true);
    }

    const handleChain = (chain, fetch) => {
        if (!chain || Object.keys(chain).length === 0)
            return;
        initializeChain(chain, (error, addressList) => {
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
            if (fetch && chain) {
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
            //@ts-ignore
            getAllBalances(chains?.chain_id, address, (err, data) => dispatch(allActions.getBalance(err, data)));
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
                    <Route path="/networks" element={<SupportedNetworks />}/>
                    <Route path="*" element={<Dashboard/>}/>
                </Routes>
            </Box>
        </Box>
    );
}

export default Main;
