import * as React from 'react';
import {Box, Grid, Typography} from "@mui/material";

function Index() {
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        height: 200,
                        backgroundColor: '#003661',
                        p: 3
                    }}>
                        <Typography variant={"h6"}>Your Network Staking</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box  sx={{
                        width: "100%",
                        p: 3
                    }}>
                        <Typography variant={"subtitle1"}>All Validators List</Typography>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
