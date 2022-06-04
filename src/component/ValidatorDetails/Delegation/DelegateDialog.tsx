import React, {useState} from "react";

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
import {useAppSelector} from "../../../customHooks/hook";
import {config} from "../../../constants/networkConfig";

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
    // const { enqueueSnackbar } = useSnackbar();
    const {t} = useTranslation();

    const validatorList = useAppSelector(state => state.stake.validators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const balance = useAppSelector(state => state.accounts.balance.result);


    const handleBalance = () => {
        const bal = balance && balance.length && balance.find((val) => val.denom === config.COIN_MINIMAL_DENOM);
        return bal?.amount / (10 ** config.COIN_DECIMALS) || 0;
    }

    const handleApplyButton = () => {
        closeDialog();
    };

    const [delegateAmount, setDelegateAmount] = useState<number | null>();

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <Stack direction="column">
                    <SelectValidator title={t("delegateSelectValidator")} validators={validatorList} images={validatorImages} initialValue={initialValidator}/>
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
