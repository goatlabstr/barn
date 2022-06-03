import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import SummaryTable from "./SummaryTable";
import {useTranslation} from "react-i18next";
import {config} from "../../constants/networkConfig";
import {useAppSelector} from "../../customHooks/hook";

function Index(props) {
    const {rows, images} = props;
    const {t} = useTranslation();

    const rewards = useAppSelector(state => state.accounts.rewards.result);
    const delegations = useAppSelector(state => state.accounts.delegations.result);

    const handleRewards = () => {
        return rewards && rewards.total && rewards.total.length &&
        rewards.total[0] && rewards.total[0].amount
            ? rewards.total[0].amount / 10 ** config.COIN_DECIMALS : 0;
    }

    const getStakedAmount = () => {
        const staked = delegations.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.balance.amount);
        }, 0);
        return staked / (10 ** config.COIN_DECIMALS);
    }

    return (
        <React.Fragment>
            <Grid container rowSpacing={0.5}>
                <>
                    <Grid item xs={10}>
                        <Typography variant={"h6"}>{t("staking.name",{"name": config.NETWORK_NAME})}</Typography>
                        <Typography variant={"body1"} style={{color: "rgb(131 157 170)"}}>{t("staking.totalStaked", {
                            "value": getStakedAmount()
                        })}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" color="secondary" size="small">{t("claimReward", {
                            "value": handleRewards(),
                            "name": config.NETWORK_NAME
                        })}</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <SummaryTable rows={rows} images={images}/>
                    </Grid>
                </>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
