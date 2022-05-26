import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import DetailViewer from "./DetailViewer";

function Index() {
    return (
        <React.Fragment>
            <Grid container rowSpacing={3}>
                <Grid item xs={10}>
                    <Typography variant={"h6"}>JUNO BALANCES</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="outlined" color="secondary" size="small">Claim Reward : 0 Juno</Button>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={"Total Balances"} amount={10} prefix={"$"} />
                </Grid>
                <Grid item xs={3}>
                    <DetailViewer title={"Available Amount"} amount={10.99}/>
                </Grid>
                <Grid item xs={3}>
                    <DetailViewer title={"Staked Amount"} amount={55.4}/>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={"Rewards"} amount={0.09}/>
                </Grid>
                <Grid item xs={2}>
                    <DetailViewer title={"Unstaked Amount"} amount={10.3}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
