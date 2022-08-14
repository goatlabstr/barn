import {alpha, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import React from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";


const useStyles = makeStyles((theme: Theme) => ({
    hashText: {
        fontWeight: 600,
        color: "rgb(131 157 170)",
        maxWidth: 175,
        textAlign: "center",
        cursor: "pointer"
    },
    hashName: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    }
}));

export const CopyAddressButton = ({address, width}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        navigator && navigator.clipboard && navigator.clipboard.writeText(address);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 1000);
    };

    return (
        <Tooltip
            arrow
            open={open}
            title="Copied!">
            <Stack direction={"row"} className={classes.hashText} onClick={handleCopy}>
                <Stack direction="row" sx={{maxWidth: width}}>
                    <Typography paragraph className={classes.hashName}>{address}</Typography>
                    <Typography paragraph>{address &&
                        address.slice(address.length - 5, address.length)}</Typography>
                </Stack>
            </Stack>
        </Tooltip>
    );
};