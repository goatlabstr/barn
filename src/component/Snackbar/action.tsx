import {IconButton} from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import * as React from "react";
import {getConfig} from "../../services/network-config";

export const snackbarTxAction = data => (key) => (
    <IconButton
        onClick={() => {
            //@ts-ignore
            window.open(getConfig("EXPLORER_URL") + "/txs/" + data, '_blank').focus();
        }}
        size="small">
        <IosShareIcon/>
    </IconButton>
);