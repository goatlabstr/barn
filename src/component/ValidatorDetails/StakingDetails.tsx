import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";

function Index() {
    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                    <Typography variant={"subtitle1"}>Juno Staking</Typography>
                    <Typography variant={"body1"} style={{color: "rgb(131 157 170)"}}>Total Staked: 10</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
