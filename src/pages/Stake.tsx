import * as React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import StakingDetails from '../component/ValidatorDetails/StakingDetails';

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    centerInnerBox: {
        width: "92%"
    }
}));

function Index() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        height: 200,
                        backgroundColor: '#003661',
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <StakingDetails />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Typography variant={"subtitle1"}>All Validators List</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
