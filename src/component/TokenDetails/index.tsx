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

function Index() {
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={10}>
                    <Typography
                        variant={"h6"}>{t("dashboard.networkBalances", {"name": config.NETWORK_NAME})}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" color="secondary" size="small">{t("claimReward", {
                        "value": 97.9,
                        "name": config.NETWORK_NAME
                    })}</Button>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={t("dashboard.totalBalances")} amount={10} prefix={"$"}
                                  icon={<AccountBalanceWalletRounded color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={3}>
                    <DetailViewer title={t("dashboard.availableAmount")} amount={10.99}
                                  icon={<CurrencyExchangeRounded color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={3}>
                    <DetailViewer title={t("dashboard.stakedAmount")} amount={55.4}
                                  icon={<AssuredWorkloadRounded color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={t("dashboard.rewards")} amount={0.09}
                                  icon={<StarsRounded color={"secondary"}/>}/>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={t("dashboard.unstakedAmount")} amount={10.3}
                                  icon={<HourglassTopRounded color={"secondary"}/>}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
