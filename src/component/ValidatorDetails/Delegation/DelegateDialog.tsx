import React, {useEffect, useState} from "react";

import {Theme} from "@mui/material/styles";

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
import {useDialog} from "../../../hooks/use-dialog/DialogContext";
import SelectValidator from "./SelectValidator";
import {useAppDispatch, useAppSelector} from "../../../hooks/hook";
import {gas} from "../../../constants/defaultGasFees";
import {getAllBalances, signTxAndBroadcast} from "../../../services/cosmos";
import allActions from "../../../action";
import {useGlobalPreloader} from "../../../hooks/useGlobalPreloader";
import {snackbarTxAction} from "../../Snackbar/action";
import {useAppState} from "../../../hooks/useAppState";
import {config} from "../../../constants/networkConfig";
import {useKeplr} from "../../../hooks/use-keplr/hook";

const useStyles = makeStyles((theme: Theme) => ({
    button: {
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
    const {closeDialog} = useDialog();
    const {enqueueSnackbar} = useSnackbar();
    const {activate, passivate} = useGlobalPreloader();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {
        appState: {
            chainInfo,
            activeValidators,
            inactiveValidators
        }
    } = useAppState();

    const {getKeplr} = useKeplr();
    const balance = useAppSelector(state => state.accounts.balance.result);
    const address = useAppSelector(state => state.accounts.address.value);


    const handleBalance = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals | 6;
        //@ts-ignore
        const bal = balance && balance.length && balance.find((val) => val.denom === chainInfo?.denom);
        return bal?.amount / (10 ** decimals) || 0;
    }

    const [delegateAmount, setDelegateAmount] = useState<number>(1);
    const [validator, setValidator] = useState<any>(initialValidator);

    const getValueObject = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals | 6;
        return {
            delegatorAddress: address,
            validatorAddress: validator?.operator_address,
            amount: {
                amount: String(delegateAmount * (10 ** decimals)),
                //@ts-ignore
                denom: chainInfo?.denom,
            },
        };
    };

    const updateBalance = async () => {
        const keplr = await getKeplr();
        //@ts-ignore
        getAllBalances(keplr, chainInfo?.chain_id, address, (err, data) => dispatch(allActions.getBalance(err, data)));
        dispatch(allActions.fetchVestingBalance(address));
        dispatch(allActions.getDelegations(address));
        dispatch(allActions.getUnBondingDelegations(address));
        dispatch(allActions.getDelegatedValidatorsDetails(address));
        dispatch(allActions.fetchRewards(address));
    }


    const handleApplyButton = async () => {
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
                    //@ts-ignore
                    denom: chainInfo?.denom,
                }],
                gas: String(gasValue),
            },
            memo: '',
        };

        const keplr = await getKeplr();
        //@ts-ignore
        signTxAndBroadcast(keplr, chainInfo?.chain_id, updatedTx, address, (error, result) => {
            passivate();
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
        closeDialog();
    };

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <Stack direction="column">
                    <SelectValidator title={t("delegateSelectValidator")}
                                     validators={activeValidators.concat(inactiveValidators)}
                                     initialValue={initialValidator}
                                     onChange={val => setValidator(val)}/>
                    <TextField
                        id="outlined-number"
                        label={t("enterDelegateTokens")}
                        type="number"
                        value={delegateAmount}
                        onChange={(e) =>
                            setDelegateAmount(parseFloat(e.target.value))}
                        InputProps={{ inputProps: { min: 1, max: handleBalance() } }}
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
