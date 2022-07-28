import * as React from 'react';
import {Avatar, Box, Chip, Grid, Typography} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import StakingDetails from '../component/ValidatorDetails/StakingDetails';
import {GeneralConstants} from "../constants/general";
import EnhancedTable from '../component/ValidatorDetails/EnhancedTable';
import {Done as ActiveIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../hooks/hook";
import {useAppState} from "../hooks/useAppState";
import MobileTable from "../component/ValidatorDetails/Mobile/MobileTable";

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
    const {
        appState: {
            activeValidators
        }
    } = useAppState();

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);

    const getDelegatedValidators = () => {
        return activeValidators.filter(valid =>
            delegatedValidatorList.some(delegated => valid?.moniker === delegated?.description?.moniker));
    }

    return (
        <React.Fragment>
            <Grid container>
                {delegatedValidatorList.length > 0 && <Grid item xs={12}>
                    <Box sx={{display: {xs: "none", md: 'block'}}}>
                        <Box sx={{
                            width: "100%",
                            //@ts-ignore
                            backgroundColor: theme.palette.background.paper,
                            p: 3
                        }} className={classes.centerBox}>
                            <Box className={classes.centerInnerBox}>
                                <StakingDetails rows={getDelegatedValidators()}/>
                            </Box>
                        </Box>
                    </Box>
                </Grid>}
                <Grid item xs={12} sx={{p: 3}}>
                    <Box sx={{display: {xs: "none", md: 'block'}}}>
                        <Box sx={{
                            width: "100%",
                            p: 3
                        }} className={classes.centerBox}>
                            <Box className={classes.centerInnerBox}>
                                <EnhancedTable rows={activeValidators} search title={t("staking.allValidators")}/>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{display: {xs: "block", md: 'none'}}}>
                        <MobileTable rows={activeValidators} viewStakedValidators title={t("staking.allValidators")}/>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
