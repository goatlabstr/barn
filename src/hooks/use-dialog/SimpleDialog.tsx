import React, {FunctionComponent} from "react";

import {Dialog, DialogTitle} from "@mui/material";

type DialogPropTypes = {
    open: boolean;
    title: string;
    content: JSX.Element;
    handleClose: () => void;
};
const SimpleDialog: FunctionComponent<DialogPropTypes> = (props) => {
    const { open, title, content, handleClose } = props;

    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            fullWidth
            maxWidth={"sm"}
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
            {content}
        </Dialog>
    );
};

export default SimpleDialog;