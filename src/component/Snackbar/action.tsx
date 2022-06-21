import {IconButton} from "@mui/material";
import {config} from "../../constants/networkConfig";
import IosShareIcon from "@mui/icons-material/IosShare";
import * as React from "react";

export const snackbarTxAction = data => (key) => (
    <IconButton
        onClick={() => {
            //@ts-ignore
            window.open(config.EXPLORER_URL + "/txs/" + data, '_blank').focus();
        }}
        size="small">
        <IosShareIcon/>
    </IconButton>
);