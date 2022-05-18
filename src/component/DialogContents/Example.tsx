import React from "react";

import { Theme } from "@mui/material/styles";

import {
    Button,
    Divider,
    DialogContent,
    DialogActions
}
from "@mui/material";
import {useDialog} from "../../context/DialogContext/DialogContext";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";

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

export default function Example() {
    const classes = useStyles();
    const { closeDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const {t} = useTranslation();


    const handleApplyButton = () => {
        enqueueSnackbar("Apply Example Job", { variant: "info"});
        closeDialog();
    };

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                {`This is an example dialog content.`}
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
                    {t("apply")}
                </Button>
            </DialogActions>
        </>
    );

}
