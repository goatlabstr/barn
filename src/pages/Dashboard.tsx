import * as React from 'react';
import {Box, Divider, Grid, Typography} from "@mui/material";

function Index() {
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        height: 150,
                        backgroundColor: '#003661',
                        p: 3
                    }}>
                        <Typography variant={"h6"}>YOUR NETWORK BALANCES</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box  sx={{
                        width: "100%",
                        p: 3,
                        backgroundColor: "#035397"
                    }}>
                        <Typography variant={"subtitle1"}>Stake Validators</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box  sx={{
                        width: "100%",
                        p: 3
                    }}>
                        <Typography variant={"subtitle1"}>Active Proposal</Typography>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
