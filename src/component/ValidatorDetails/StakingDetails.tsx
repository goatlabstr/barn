import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import SummaryTable from "./SummaryTable";

function Index(props) {
    const {rows} = props;
    return (
        <React.Fragment>
            <Grid container rowSpacing={1}>
                <>
                    <Grid item xs={10}>
                        <Typography variant={"subtitle1"}>Juno Staking</Typography>
                        <Typography variant={"body1"} style={{color: "rgb(131 157 170)"}}>Total Staked: 200.013K</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" color="secondary" size="small">Claim Reward : 97.9 Juno</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <SummaryTable rows={rows}/>
                    </Grid>
                </>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
