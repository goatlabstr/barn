import * as React from 'react';
import {useEffect, useState} from 'react';
import {Avatar, Box, Button, CircularProgress, Grid, Stack, TextField, Typography} from "@mui/material";
import DetailViewer from "./DetailViewer";
import {
    AccountBalanceWalletRounded,
    AssuredWorkloadRounded,
    CurrencyExchangeRounded,
    HourglassTopRounded, MonetizationOnRounded,
    StarsRounded
} from '@mui/icons-material';
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../hooks/hook";
import {useAppState} from "../../hooks/useAppState";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {gas} from "../../constants/defaultGasFees";
import {signTxAndBroadcast} from "../../services/cosmos";
import {useSnackbar} from "notistack";
import allActions from "../../action";
import {snackbarTxAction} from "../Snackbar/action";
import {config} from "../../constants/networkConfig";
import {useKeplr} from "../../hooks/use-keplr/hook";

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        [theme.breakpoints.down('md')]: {
            fontSize: "large",
        }
    }
}));

export default function Index() {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const [walletName, setWalletName] = useState("");
    const classes = useStyles();
    const {
        appState: {
            chainInfo,
            currentPrice
        }
    } = useAppState();

    const [inTxProgress, setInTxProgress] = useState(false);
    const {keplr} = useKeplr();

    const rewards = useAppSelector(state => state.accounts.rewards.result);
    const address = useAppSelector(state => state.accounts.address.value);
    const balance = useAppSelector(state => state.accounts.balance.result);
    const delegations = useAppSelector(state => state.accounts.delegations.result);
    const unBondingDelegations = useAppSelector(state => state.accounts.unBondingDelegations.result);

    useEffect(() => {
        if (keplr)
            //@ts-ignore
            keplr.getKey(chainInfo?.chain_id).then(walletData => setWalletName(walletData?.name));
    }, [address])

    const handleBalance = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        //@ts-ignore
        const bal = balance && balance.length && balance.find((val) => val.denom === chainInfo?.denom);
        return bal?.amount / (10 ** decimals) || 0;
    }

    const handleRewards = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        const mainRewards = rewards && rewards.total && rewards.total.length &&
            //@ts-ignore
            rewards.total.filter(r => r?.denom === chainInfo?.denom);
        return mainRewards && mainRewards.length && mainRewards[0] && mainRewards[0].amount
            ? mainRewards[0].amount / 10 ** decimals : 0;
    }

    const handleStakedAmount = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        const staked = delegations.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.balance.amount);
        }, 0);
        return staked / (10 ** decimals);
    }

    const handleUnstakedAmount = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        let unStaked = 0;
        unBondingDelegations.map((delegation) => {
            delegation.entries && delegation.entries.length &&
            delegation.entries.map((entry) => {
                unStaked = unStaked + Number(entry.balance);
                return null;
            });
            return null;
        });
        return unStaked / (10 ** decimals);
    }

    const handleTotalBalance = () => {
        if (currentPrice)
            return (currentPrice * (handleBalance() + handleRewards() +
                handleStakedAmount() + handleUnstakedAmount())).toFixed(2);
        return 0;
    }

    const updateBalance = async () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        const tokens = rewards && rewards.length && rewards[0] && rewards[0].reward &&
        rewards[0].reward.length && rewards[0].reward[0] && rewards[0].reward[0].amount
            ? rewards[0].reward[0].amount / 10 ** decimals : 0;
        //@ts-ignore
        // getAllBalances(keplr, chainInfo?.chain_id, address, (err, data) => dispatch(allActions.getBalance(err, data)));
        dispatch(allActions.getAllBalance(address));
        dispatch(allActions.fetchVestingBalance(address));
        dispatch(allActions.fetchRewards(address));
        dispatch(allActions.setTokens(tokens));
    }

    const handleClaimAll = async () => {
        setInTxProgress(true);
        let gasValue = gas.claim_reward;
        if (rewards && rewards.rewards && rewards.rewards.length > 1) {
            gasValue = (rewards.rewards.length - 1) / 2 * gas.claim_reward + gas.claim_reward;
        }

        const updatedTx = {
            msgs: [],
            fee: {
                amount: [{
                    amount: String(gasValue * config.GAS_PRICE_STEP_AVERAGE),
                    //@ts-ignore
                    denom: chainInfo?.denom,
                }],
                gas: String(gasValue),
            },
            memo: '',
        };

        if (rewards?.rewards?.length) {
            rewards?.rewards?.map((item) => {
                //@ts-ignore
                updatedTx.msgs.push({
                    //@ts-ignore
                    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
                    //@ts-ignore
                    value: {
                        //@ts-ignore
                        delegatorAddress: address,
                        //@ts-ignore
                        validatorAddress: item.validator_address,
                    },
                });
                return null;
            });
        }

        //@ts-ignore
        signTxAndBroadcast(keplr, chainInfo?.chain_id, updatedTx, address, (error, result) => {
            setInTxProgress(false);
            if (error) {
                enqueueSnackbar(error, {variant: "error"});
                return;
            }
            if (result) {
                enqueueSnackbar(result?.transactionHash, {
                    variant: "success",
                    autoHideDuration: 3000,
                    action: (key) => snackbarTxAction(result?.transactionHash)(key)
                });
                updateBalance();
            }
        });
    };

    const getUnbondingPeriodText = (time) => {
        let result = 0;
        if (time !== undefined)
            result = time / (24 * 60 * 60);
        result = Math.round(result);
        if (result)
            return " (" + result + " days)"
        else
            return "";
    }

    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={12} md={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" alignItems={"center"} spacing={1.25}>
                            {//@ts-ignore
                                chainInfo?.image && <Avatar src={chainInfo?.image}/>
                            }
                            <Stack direction="column">
                                <Typography
                                    //@ts-ignore
                                    variant={"h6"}>{t("dashboard.networkBalances", {"name": chainInfo?.pretty_name})}</Typography>
                                <Stack direction="row" spacing={0.5} alignItems={"center"} sx={{mt: -0.5}}>
                                    <img src={"/keplr-logo.png"} style={{height: 14}}/>
                                    <Typography variant={"body1"} color={"secondary"}>{walletName}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Button variant="outlined"
                                color="secondary"
                                disabled={inTxProgress || handleRewards() <= 0}
                                onClick={() => handleClaimAll()}
                                size="small"
                                sx={{height: "fit-content"}}>
                            {inTxProgress && <CircularProgress color="inherit" size={20} sx={{mr: 1}}/>}
                            <Box sx={{display: {xs: "none", md: 'block'}}}>
                                {t("claimReward", {
                                    "value": handleRewards().toFixed(3),
                                    //@ts-ignore
                                    "name": chainInfo?.symbol
                                })}
                            </Box>
                            <Box sx={{display: {xs: "block", md: 'none'}}}>
                                {t("claimAll")}
                            </Box>
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{display: {md: "none"}}}>
                    <DetailViewer title={t("dashboard.tokenPrice", {
                        //@ts-ignore
                        name: chainInfo?.symbol
                    })} amount={currentPrice} prefix={"$"}
                                  icon={<MonetizationOnRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={6} md={2}>
                    <DetailViewer title={t("dashboard.totalBalances")} amount={handleTotalBalance()} prefix={"$"}
                                  icon={<AccountBalanceWalletRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={6} md={3}>
                    <DetailViewer title={t("dashboard.availableAmount")} amount={handleBalance().toFixed(3)}
                                  icon={<CurrencyExchangeRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={6} md={3}>
                    <DetailViewer title={t("dashboard.stakedAmount")} amount={handleStakedAmount().toFixed(3)}
                                  icon={<AssuredWorkloadRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={6} md={2}>
                    <DetailViewer title={t("dashboard.rewards")} amount={handleRewards().toFixed(3)}
                                  icon={<StarsRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={6} md={2}>
                    <DetailViewer title={t("dashboard.unstakedAmount")}
                        //@ts-ignore
                                  amount={handleUnstakedAmount().toFixed(3) + getUnbondingPeriodText(chainInfo?.params?.unbonding_time)}
                                  icon={<HourglassTopRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
