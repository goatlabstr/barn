import * as React from 'react';
import {Avatar, Box, Chip, Grid, Typography} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import StakingDetails from '../component/ValidatorDetails/StakingDetails';
import {GeneralConstants} from "../constants/general";
import EnhancedTable from '../component/ValidatorDetails/EnhancedTable';
import {Done as ActiveIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../customHooks/hook";

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

function Index() {
    const classes = useStyles();
    const theme = useTheme();
    const {t} = useTranslation();

    const validatorList = useAppSelector(state => state.stake.validators.list);
    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);

    return (
        <React.Fragment>
            <Grid container>
                {delegatedValidatorList.length > 0 && <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        //@ts-ignore
                        backgroundColor: theme.palette.background.paper,
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <StakingDetails rows={delegatedValidatorList} images={validatorImages}/>
                        </Box>
                    </Box>
                </Grid>}
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <EnhancedTable rows={validatorList} images={validatorImages} search title={t("staking.allValidators")}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
