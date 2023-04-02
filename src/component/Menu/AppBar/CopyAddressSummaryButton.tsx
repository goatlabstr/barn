import {IconButton, Tooltip} from "@mui/material";
import React from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const CopyAddressSummaryButton = ({address}) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        navigator && navigator.clipboard && navigator.clipboard.writeText(address);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 5000);
    };

    return (
        <Tooltip
            arrow
            title="Copy Address">
            <IconButton size={"small"} color={open ? "success" : "primary"} onClick={handleCopy}>
                <ContentCopyIcon sx={{height: 18}}/>
            </IconButton>
        </Tooltip>
    );
};