import React from "react";

import { Theme } from "@mui/material/styles";

import {
    Button,
    Divider,
    DialogContent,
    DialogActions
}
    from "@mui/material";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {useDialog} from "../../../context/DialogContext/DialogContext";
import SelectValidator from "./SelectValidator";
import {useAppSelector} from "../../../customHooks/hook";

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

export default function RedelegateDialog({initialValidator}) {
    const classes = useStyles();
    const { closeDialog } = useDialog();
    // const { enqueueSnackbar } = useSnackbar();
    const {t} = useTranslation();

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);

    const handleApplyButton = () => {
        closeDialog();
    };

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <SelectValidator title={t("redelegateSelectValidator")} validators={delegatedValidatorList} images={validatorImages} initialValue={initialValidator}/>
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
                    {t("redelegate")}
                </Button>
            </DialogActions>
        </>
    );

}
