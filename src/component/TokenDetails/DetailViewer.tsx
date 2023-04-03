import * as React from 'react';
import {ReactElement} from 'react';
import {Grid, Stack, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        borderLeft: "solid 0px transparent",
        color: "rgb(131 157 170)",
        fontWeight: 600
    },
    details: {
        fontWeight: 600,
        letterSpacing: 0
    }
}));

type DetailViewerProps = {
    title: String,
    amount: number | String,
    prefix?: String,
    icon?: ReactElement,
    secondaryText?: String
}

function Index(props: DetailViewerProps) {
    const {title, amount, prefix, icon, secondaryText} = props;
    const classes = useStyles();
    const amountText = prefix ? prefix + "" + amount : amount;

    return (
        <Stack direction="column" spacing={1}>
            <Typography variant={"subtitle2"} className={classes.title}>{title}</Typography>
            <Stack direction="row" spacing={1} sx={{
                alignItems: "center",
                display: "flex"
            }}>
                {icon}
                <Typography variant={"h5"} className={classes.details}>{amountText}</Typography>
                {secondaryText && <Typography variant={"body2"} color={"secondary"}>{secondaryText}</Typography>}
            </Stack>
        </Stack>
    );
}

export default Index;
