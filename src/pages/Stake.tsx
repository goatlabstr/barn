import * as React from 'react';
import {Avatar, Box, Chip, Grid, Typography} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import StakingDetails from '../component/ValidatorDetails/StakingDetails';
import {GeneralConstants} from "../constants/general";
import EnhancedTable from '../component/ValidatorDetails/EnhancedTable';
import {Done as ActiveIcon} from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        justifyContent: "center",
        height: "auto"
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

const rows = [
    createData('Cupcake', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 3.7, 67, 4.3,
        <Typography>Action</Typography>,<Avatar>C</Avatar>),
    createData('Donut', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 251234, 51, 200000,
        <Typography>Action</Typography>,<Avatar>D</Avatar>),
    createData('Eclair', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 16000000, 24, 0,
        <Typography>Action</Typography>,<Avatar>E</Avatar>),
    createData('Frozen yoghurt', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 61234567989, 24, 0,
        <Typography>Action</Typography>,<Avatar>F</Avatar>),
    createData('Gingerbread', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 16.0, 49, 0,
        <Typography>Action</Typography>,<Avatar>G</Avatar>),
    createData('Honeycomb', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 3200000, 87, 0,
        <Typography>Action</Typography>,<Avatar>H</Avatar>),
    createData('Ice cream sandwich', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 9.0, 37, 0,
        <Typography>Action</Typography>,<Avatar>I</Avatar>),
    createData('Jelly Bean', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 0.0, 94, 0,
        <Typography>Action</Typography>,<Avatar>J</Avatar>),
    createData('KitKat', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 26.0, 65, 7.0,
        <Typography>Action</Typography>,<Avatar>K</Avatar>),
    createData('Lollipop', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 0.2, 98, 0,
        <Typography>Action</Typography>,<Avatar>L</Avatar>),
    createData('Marshmallow', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 0, 81, 0,
        <Typography>Action</Typography>,<Avatar>M</Avatar>),
    createData('Nougat', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 19.0, 9, 37.0,
        <Typography>Action</Typography>,<Avatar>N</Avatar>),
    createData('Oreo', <Chip label="Active" variant="filled" icon={<ActiveIcon/>}/>, 18.0, 63, 0,
        <Typography>Action</Typography>,<Avatar>O</Avatar>),
];

function createActiveData(
    validator: string,
    stakeAmount: number,
    pendingRewards: number,
    avatar: any
) {
    return {
        validator,
        stakeAmount,
        pendingRewards,
        avatar
    };
}


const activeRows = [
    createActiveData('Cupcake', 3.7, 0.02, <Avatar>C</Avatar>),
    createActiveData('Donut',200000, 89, <Avatar>D</Avatar>),
    createActiveData('Nougat', 9, 8.88, <Avatar>N</Avatar>),
];

function Index() {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <React.Fragment>
            <Grid container>
                {activeRows.length > 0 && <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        height: 550,
                        //@ts-ignore
                        backgroundColor: theme.palette.background.paper,
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <StakingDetails rows={activeRows}/>
                        </Box>
                    </Box>
                </Grid>}
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <EnhancedTable rows={rows} title={"All Validators"}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
