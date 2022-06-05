import * as React from 'react';
import {Box, Button, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import SummaryTable from "./SummaryTable";
import {useTranslation} from "react-i18next";
import {config} from "../../constants/networkConfig";
import {useAppDispatch, useAppSelector} from "../../customHooks/hook";
import allActions from "../../action";
import {gas} from "../../constants/defaultGasFees";
import {signTxAndBroadcast} from "../../services/cosmos";
import {useState} from "react";
import {useSnackbar} from "notistack";

function Index(props) {
    const {rows, images} = props;
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [inTxProgress, setInTxProgress] = useState(false);

    const rewards = useAppSelector(state => state.accounts.rewards.result);
    const address = useAppSelector(state => state.accounts.address.value);
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


    const updateBalance = () => {
        const tokens = rewards && rewards.length && rewards[0] && rewards[0].reward &&
        rewards[0].reward.length && rewards[0].reward[0] && rewards[0].reward[0].amount
            ? rewards[0].reward[0].amount / 10 ** config.COIN_DECIMALS : 0;
        dispatch(allActions.getBalance(address));
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
                enqueueSnackbar(result?.transactionHash, {variant: "success"});
                updateBalance();
            }
        });
    };

    return (
        <React.Fragment>
            <Grid container rowSpacing={0.5}>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between">
                            <div>
                                <Typography variant={"h6"}>{t("staking.name",{"name": config.NETWORK_NAME})}</Typography>
                                <Typography variant={"body1"} style={{color: "rgb(131 157 170)"}}>{t("staking.totalStaked", {
                                    "value": getStakedAmount()
                                })}</Typography>
                            </div>
                            <Button variant="outlined"
                                    color="secondary"
                                    disabled={inTxProgress || handleRewards() <= 0}
                                    onClick={() => handleClaimAll()}
                                    size="small"
                                    sx={{height: "fit-content"}}>
                                {inTxProgress && <CircularProgress color="inherit" size={20} sx={{mr: 1}}/>}
                                {t("claimReward", {
                                "value": handleRewards(),
                                "name": config.NETWORK_NAME
                            })}</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <SummaryTable rows={rows} images={images}/>
                    </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
