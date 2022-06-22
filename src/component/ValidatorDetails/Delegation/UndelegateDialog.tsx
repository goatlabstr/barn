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
import allActions from "../../../action";
import {gas} from "../../../constants/defaultGasFees";
import {getAllBalances, signTxAndBroadcast} from "../../../services/cosmos";
import {useGlobalPreloader} from "../../../context/GlobalPreloaderProvider";
import {snackbarTxAction} from "../../Snackbar/action";

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

export default function UndelegateDialog({initialValidator}) {
    const classes = useStyles();
    const { closeDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const {activate, passivate} = useGlobalPreloader();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const [validatorUndelegateAmount, setValidatorUndelegateAmount] = useState<number>(0);
    const [undelegateAmount, setUndelegateAmount] = useState<number>(0);
    const [validator, setValidator] = useState<any>(initialValidator);

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const address = useAppSelector(state => state.accounts.address.value);
    const delegations = useAppSelector(state => state.accounts.delegations.result);


    const getValueObject = () => {
        return {
            delegatorAddress: address,
            validatorAddress: validator?.operator_address,
            amount: {
                amount: String(undelegateAmount * (10 ** config.COIN_DECIMALS)),
                denom: config.COIN_MINIMAL_DENOM,
            },
        };
    };

    const updateBalance = () => {
        getAllBalances(address,(err, data) => dispatch(allActions.getBalance(err,data)));
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
                typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
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

    useEffect(() => {
        const found = delegations.find(el => el?.delegation?.validator_address === validator?.operator_address);
        if(found !== undefined)
            setValidatorUndelegateAmount(found?.balance?.amount / (10 ** config.COIN_DECIMALS));
    },[validator])



    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <Stack direction="column">
                <SelectValidator title={t("undelegateSelectValidator")}
                                 validators={delegatedValidatorList}
                                 images={validatorImages}
                                 onChange={val => setValidator(val)}
                                 initialValue={initialValidator}/>
                    <TextField
                        id="outlined-number"
                        label={t("enterDelegateTokens")}
                        type="number"
                        value={undelegateAmount}
                        onChange={(e) =>
                            setUndelegateAmount(parseFloat(e.target.value))}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{marginTop: 2}}
                    />
                    <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
                        <p style={{fontSize: 11, color: "rgb(131 157 170)"}}>{t("maxAvailableToken")}</p>
                        <Typography variant="body2"
                                    color="secondary"
                                    onClick={() => setUndelegateAmount(validatorUndelegateAmount)}
                                    sx={{fontSize: 11, cursor: "pointer"}}>{validatorUndelegateAmount}</Typography>
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
                    {t("undelegate")}
                </Button>
            </DialogActions>
        </>
    );

}
