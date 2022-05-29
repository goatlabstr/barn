import * as React from 'react';
import {Avatar, Box, Button, Chip, Grid, Stack, Typography} from "@mui/material";
import TokenDetails from '../component/TokenDetails/index';
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {GeneralConstants} from "../constants/general";
import {Done as ActiveIcon} from "@mui/icons-material";
import EnhancedTable from "../component/ValidatorDetails/EnhancedTable";
import {useNavigate} from "react-router-dom";
import SummaryProposalList from "../component/GovernanceDetails/ActiveProposalList";

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        justifyContent: "center"
    },
    centerInnerBox: {
        width: GeneralConstants.mainContent.width
    }
}));

function createData(
    validator: string,
    status: any,
    votingPower: number,
    commission: number,
    stakeAmount: number,
    action: any,
    avatar: any
) {
    return {
        validator,
        status,
        votingPower,
        commission,
        stakeAmount,
        action,
        avatar
    };
}

const activeRows = [
    createData('Cupcake', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 3.7, 67, 4.3,
        <Typography>Action</Typography>, <Avatar>C</Avatar>),
    createData('Donut', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 251234, 51, 200000,
        <Typography>Action</Typography>, <Avatar>D</Avatar>),
    createData('Nougat', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 19.0, 9, 37.0,
        <Typography>Action</Typography>, <Avatar>N</Avatar>),
];

function Index() {
    const classes = useStyles();
    let navigate = useNavigate();
    const theme = useTheme();

    return (
        <React.Fragment>
            <Grid container>
                <Grid item md={12} xl={12}>
                    <Box sx={{
                        width: "100%",
                        height: 200,
                        //@ts-ignore
                        backgroundColor: theme.palette.background.dark,
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <TokenDetails/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={12} xl={9}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <EnhancedTable rows={activeRows}
                                           title="Staked Validators"
                                           buttonTitle="View All"
                                           onClickToolbarButton={() => {
                                               navigate("/stake")
                                           }}
                                           search
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={12} xl={3}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Stack direction="row" justifyContent={"space-between"} spacing={1}>
                                <Typography variant={"subtitle1"}>Active Proposal</Typography>
                                <Button variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate("/governance")}>View All</Button>
                            </Stack>
                            <SummaryProposalList/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
