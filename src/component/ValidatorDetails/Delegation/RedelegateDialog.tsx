import React, {useEffect, useState} from "react";

import {Theme} from "@mui/material/styles";

import {
    Button,
    Divider,
    DialogContent,
    DialogActions, Stack, TextField, Typography
}
    from "@mui/material";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {useDialog} from "../../../hooks/use-dialog/DialogContext";
import SelectValidator from "./SelectValidator";
import {useAppDispatch, useAppSelector} from "../../../hooks/hook";
import allActions from "../../../action";
import {gas} from "../../../constants/defaultGasFees";
import {signTxAndBroadcast} from "../../../services/cosmos";
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

export default function RedelegateDialog({initialValidator}) {
    const classes = useStyles();
    const {closeDialog} = useDialog();
    const {enqueueSnackbar} = useSnackbar();
    const {activate, passivate} = useGlobalPreloader();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {
        appState: {
            activeValidators,
            inactiveValidators,
            chainInfo
        }
    } = useAppState();

    const {keplr} = useKeplr();
    const [fromValidator, setFromValidator] = useState<any>(initialValidator);
    const [toValidator, setToValidator] = useState<any>();
    const [redelegateAmount, setRedelegateAmount] = useState<number>(1);
    const [validatorRedelegateAmount, setValidatorRedelegateAmount] = useState<number>(0);

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const address = useAppSelector(state => state.accounts.address.value);
    const delegations = useAppSelector(state => state.accounts.delegations.result);

    const getDelegatedValidators = () => {
        return activeValidators.filter(valid =>
            delegatedValidatorList.some(delegated => valid?.moniker === delegated?.description?.moniker));
    }


    useEffect(() => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        const found = delegations.find(el => el?.delegation?.validator_address === fromValidator?.operator_address);
        if (found !== undefined)
            setValidatorRedelegateAmount(found?.balance?.amount / (10 ** decimals));
    }, [fromValidator])


    const getValueObject = () => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        return {
            delegatorAddress: address,
            validatorSrcAddress: fromValidator?.operator_address,
            validatorDstAddress: toValidator?.operator_address,
            amount: {
                amount: String(redelegateAmount * (10 ** decimals)),
                //@ts-ignore
                denom: chainInfo?.denom,
            },
        };
    };

    const updateBalance = async () => {
        //@ts-ignore
        // getAllBalances(keplr, chainInfo?.chain_id, address, (err, data) => dispatch(allActions.getBalance(err, data)));
        dispatch(allActions.getAllBalance(address));
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
                typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
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

        //@ts-ignore
        signTxAndBroadcast(keplr, chainInfo?.chain_id, updatedTx, address, (error, result) => {
            passivate();
            if (error) {
                /*if (error.indexOf('not yet found on the chain') > -1) {
                    return;
                }*/
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
            <DialogContent sx={{bgcolor: 'background.paper', justifyContent: "center"}}>
                <Stack direction="column">
                    <Stack direction="column" spacing={2}>
                        <SelectValidator title={t("delegatedValidator")}
                                         validators={getDelegatedValidators()}
                                         onChange={val => setFromValidator(val)}
                                         initialValue={initialValidator}/>
                        <SelectValidator title={t("redelegateSelectValidator")}
                                         validators={activeValidators.concat(inactiveValidators)}
                                         onChange={val => setToValidator(val)}/>
                    </Stack>
                    <TextField
                        id="outlined-number"
                        label={t("enterDelegateTokens")}
                        type="number"
                        value={redelegateAmount}
                        InputProps={{ inputProps: { min: 1, max: validatorRedelegateAmount } }}
                        onChange={(e) =>
                            setRedelegateAmount(parseFloat(e.target.value))}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{marginTop: 2}}
                    />
                    <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                        <p style={{fontSize: 11, color: "rgb(131 157 170)"}}>{t("maxAvailableToken")}</p>
                        <Typography variant="body2"
                                    color="secondary"
                                    onClick={() => setRedelegateAmount(validatorRedelegateAmount)}
                                    sx={{fontSize: 11, cursor: "pointer"}}>{validatorRedelegateAmount}</Typography>
                    </Stack>
                </Stack>
            </DialogContent>
            <Divider/>
            <DialogActions sx={{bgcolor: 'background.paper'}}>
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
                    color="warning"
                    sx={{color: "white"}}
                    onClick={handleApplyButton}
                >
                    {t("redelegate")}
                </Button>
            </DialogActions>
        </>
    );

}
