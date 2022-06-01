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
    icon?: ReactElement
}

function Index(props: DetailViewerProps) {
    const {title, amount, prefix, icon} = props;
    const classes = useStyles();
    const amountText = prefix ? prefix + "" + amount : amount;

    return (
        <React.Fragment>
            <Grid container rowSpacing={0.5}>
                <Grid item xs={12}>
                    <Typography variant={"subtitle2"} className={classes.title}>{title}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1} style={{
                        alignItems: "center",
                        display: "flex"
                    }}>
                        {icon}
                        <Typography variant={"h2"} className={classes.details}>{amountText}</Typography>
                    </Stack>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
