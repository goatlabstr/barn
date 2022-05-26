import * as React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import TokenDetails from '../component/TokenDetails/index';
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    centerInnerBox:{
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
                            <TokenDetails/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 3,
                        backgroundColor: "#035397"
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Typography variant={"subtitle1"}>Stake Validators</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Typography variant={"subtitle1"}>Active Proposal</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
