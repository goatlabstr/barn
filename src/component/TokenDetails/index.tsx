import * as React from 'react';
import {Button, CircularProgress, Grid, IconButton, Stack, Typography} from "@mui/material";
import DetailViewer from "./DetailViewer";
import {
    AccountBalanceWalletRounded,
    AssuredWorkloadRounded,
    CurrencyExchangeRounded,
    HourglassTopRounded,
    StarsRounded
} from '@mui/icons-material';
import {useTranslation} from "react-i18next";
import {config} from '../../constants/networkConfig';
import {useAppDispatch, useAppSelector} from "../../customHooks/hook";
import {useAppState} from "../../context/AppStateContext";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {gas} from "../../constants/defaultGasFees";
import {useGlobalPreloader} from "../../context/GlobalPreloaderProvider";
import {getAllBalances, signTxAndBroadcast} from "../../services/cosmos";
import {useSnackbar} from "notistack";
import allActions from "../../action";
import {useState} from "react";
import {snackbarTxAction} from "../Snackbar/action";

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
    const classes = useStyles();
    const {
        appState: {currentPrice}
    } = useAppState();

    const [inTxProgress, setInTxProgress] = useState(false);

    const rewards = useAppSelector(state => state.accounts.rewards.result);
    const address = useAppSelector(state => state.accounts.address.value);
    const balance = useAppSelector(state => state.accounts.balance.result);
    const delegations = useAppSelector(state => state.accounts.delegations.result);
    const unBondingDelegations = useAppSelector(state => state.accounts.unBondingDelegations.result);

    const handleBalance = () => {
        const bal = balance && balance.length && balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        return bal?.amount / (10 ** config.COIN_DECIMALS) || 0;
    }

    const handleRewards = () => {
        return rewards && rewards.total && rewards.total.length &&
        rewards.total[0] && rewards.total[0].amount
            ? rewards.total[0].amount / 10 ** config.COIN_DECIMALS : 0;
    }

    const handleStakedAmount = () => {
        const staked = delegations.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.balance.amount);
        }, 0);
        return staked / (10 ** config.COIN_DECIMALS);
    }

    const handleUnstakedAmount = () => {
        let unStaked = 0;
        unBondingDelegations.map((delegation) => {
            delegation.entries && delegation.entries.length &&
            delegation.entries.map((entry) => {
                unStaked = unStaked + Number(entry.balance);
                return null;
            });
            return null;
        });
        return unStaked / (10 ** config.COIN_DECIMALS);
    }

    const handleTotalBalance = () => {
        if (currentPrice)
            return (currentPrice * (handleBalance() + handleRewards() +
                handleStakedAmount() + handleUnstakedAmount())).toFixed(2);
        return 0;
    }

    const updateBalance = () => {
        const tokens = rewards && rewards.length && rewards[0] && rewards[0].reward &&
        rewards[0].reward.length && rewards[0].reward[0] && rewards[0].reward[0].amount
            ? rewards[0].reward[0].amount / 10 ** config.COIN_DECIMALS : 0;
        getAllBalances(address,(err, data) => dispatch(allActions.getBalance(err,data)));
        dispatch(allActions.fetchVestingBalance(address));
        dispatch(allActions.fetchRewards(address));
        dispatch(allActions.setTokens(tokens));
    }

    const handleClaimAll = () => {
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
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(gasValue),
            },
            memo: '',
        };

        if (rewards?.rewards?.length) {
            rewards?.rewards?.map((item) => {
                updatedTx.msgs.push({
                    //@ts-ignore
                    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
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

        signTxAndBroadcast(updatedTx, address, (error, result) => {
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

    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={12} lg={12}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography
                            variant={"h6"}>{t("dashboard.networkBalances", {"name": config.NETWORK_NAME})}</Typography>
                        <Button variant="outlined"
                                color="secondary"
                                disabled={inTxProgress || handleRewards() <= 0}
                                onClick={() => handleClaimAll()}
                                size="small"
                                sx={{height: "fit-content"}}>
                            {inTxProgress && <CircularProgress color="inherit" size={20} sx={{mr: 1}}/>}
                            {t("claimReward", {
                                "value": handleRewards().toFixed(3),
                                "name": config.NETWORK_NAME
                            })}</Button>
                    </Stack>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.totalBalances")} amount={handleTotalBalance()} prefix={"$"}
                                  icon={<AccountBalanceWalletRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={3}>
                    <DetailViewer title={t("dashboard.availableAmount")} amount={handleBalance().toFixed(3)}
                                  icon={<CurrencyExchangeRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={3}>
                    <DetailViewer title={t("dashboard.stakedAmount")} amount={handleStakedAmount().toFixed(3)}
                                  icon={<AssuredWorkloadRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.rewards")} amount={handleRewards().toFixed(3)}
                                  icon={<StarsRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.unstakedAmount")} amount={handleUnstakedAmount().toFixed(3)}
                                  icon={<HourglassTopRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
