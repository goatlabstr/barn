import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";
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
import {useAppSelector} from "../../customHooks/hook";
import {useAppState} from "../../context/AppStateContext";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        [theme.breakpoints.down('md')]: {
            fontSize: "large",
        }
    }
}));

function Index() {
    const {t} = useTranslation();
    const classes = useStyles();
    const {
        appState: {currentPrice}
    } = useAppState();

    const rewards = useAppSelector(state => state.accounts.rewards.result);
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

    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={10} lg={10}>
                    <Typography
                        variant={"h6"}>{t("dashboard.networkBalances", {"name": config.NETWORK_NAME})}</Typography>
                </Grid>
                <Grid item xs={2} lg={2}>
                    <Button variant="outlined" color="secondary" size="small">{t("claimReward", {
                        "value": handleRewards(),
                        "name": config.NETWORK_NAME
                    })}</Button>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.totalBalances")} amount={handleTotalBalance()} prefix={"$"}
                                  icon={<AccountBalanceWalletRounded className={classes.icon} color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={3}>
                    <DetailViewer title={t("dashboard.availableAmount")} amount={handleBalance()}
                                  icon={<CurrencyExchangeRounded className={classes.icon}  color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={3}>
                    <DetailViewer title={t("dashboard.stakedAmount")} amount={handleStakedAmount()}
                                  icon={<AssuredWorkloadRounded className={classes.icon}  color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.rewards")} amount={handleRewards()}
                                  icon={<StarsRounded className={classes.icon}  color={"secondary"}/>}/>
                </Grid>
                <Grid item lg={2}>
                    <DetailViewer title={t("dashboard.unstakedAmount")} amount={handleUnstakedAmount()}
                                  icon={<HourglassTopRounded className={classes.icon}  color={"secondary"}/>}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
