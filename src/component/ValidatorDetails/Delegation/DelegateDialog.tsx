import React, {useEffect, useState} from "react";

import { Theme } from "@mui/material/styles";

import {
    Button,
    Divider,
    DialogContent,
    DialogActions, TextField, Stack, Typography
}
    from "@mui/material";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {useDialog} from "../../../context/DialogContext/DialogContext";
import SelectValidator from "./SelectValidator";
import {useAppDispatch, useAppSelector} from "../../../customHooks/hook";
import {config} from "../../../constants/networkConfig";
import {gas} from "../../../constants/defaultGasFees";
import {signTxAndBroadcast} from "../../../services/cosmos";
import allActions from "../../../action";
import {useGlobalPreloader} from "../../../context/GlobalPreloaderProvider";

const useStyles = makeStyles((theme: Theme) => ({
    button:{
        marginLeft: theme.spacing(2)
    },
    content: {
        margin: theme.spacing(1)
    },
    progress: {
        marginRight: theme.spacing(1)
    }
}));

export default function DelegateDialog({initialValidator}) {
    const classes = useStyles();
    const { closeDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const {activate, passivate} = useGlobalPreloader();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const validatorList = useAppSelector(state => state.stake.validators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const balance = useAppSelector(state => state.accounts.balance.result);
    const address = useAppSelector(state => state.accounts.address.value);


    const handleBalance = () => {
        const bal = balance && balance.length && balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        return bal?.amount / (10 ** config.COIN_DECIMALS) || 0;
    }

    const [delegateAmount, setDelegateAmount] = useState<number>(0);
    const [validator, setValidator] = useState<any>(initialValidator);

    const getValueObject = () => {
        return {
            delegatorAddress: address,
            validatorAddress: validator?.operator_address,
            amount: {
                amount: String(delegateAmount * (10 ** config.COIN_DECIMALS)),
                denom: config.COIN_MINIMAL_DENOM,
            },
        };
    };

    const updateBalance = () => {
        dispatch(allActions.getBalance(address));
        dispatch(allActions.fetchVestingBalance(address));
        dispatch(allActions.getDelegations(address));
        dispatch(allActions.getUnBondingDelegations(address));
        dispatch(allActions.getDelegatedValidatorsDetails(address));
        dispatch(allActions.fetchRewards(address));
    }


    const handleApplyButton = () => {
        activate();
        let gasValue = gas.delegate;

        const updatedTx = {
            msg: {
                typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
                value: getValueObject(),
            },
            fee: {
                amount: [{
                    amount: String(gasValue * config.GAS_PRICE_STEP_AVERAGE),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(gasValue),
            },
            memo: '',
        };
        signTxAndBroadcast(updatedTx, address, (error, result) => {
            passivate();
            if (error) {
                enqueueSnackbar(error, {variant: "error"});
                return;
            }
            if (result) {
                enqueueSnackbar(result?.transactionHash, {variant: "success"});
                updateBalance();
            }
        });
        closeDialog();
    };

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <Stack direction="column">
                    <SelectValidator title={t("delegateSelectValidator")}
                                     validators={validatorList}
                                     images={validatorImages}
                                     initialValue={initialValidator}
                                     onChange={val => setValidator(val)}/>
                    <TextField
                        id="outlined-number"
                        label={t("enterDelegateTokens")}
                        type="number"
                        value={delegateAmount}
                        onChange={(e) =>
                            setDelegateAmount(parseInt(e.target.value))}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{marginTop: 2}}
                    />
                    <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                        <p style={{fontSize: 11, color: "rgb(131 157 170)"}}>{t("maxAvailableToken")}</p>
                        <Typography variant="body2"
                                    color="secondary"
                                    onClick={() => setDelegateAmount(handleBalance())}
                                    sx={{fontSize: 11, cursor: "pointer"}}>{handleBalance()}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <Divider/>
            <DialogActions>
                <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    onClick={closeDialog}
                >
                    {t("cancel")}
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleApplyButton}
                >
                    {t("delegate")}
                </Button>
            </DialogActions>
        </>
    );

}
