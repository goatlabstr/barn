import * as React from 'react';
import {Avatar, Box, Chip, Grid, Typography} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import StakingDetails from '../component/ValidatorDetails/StakingDetails';
import {GeneralConstants} from "../constants/general";
import EnhancedTable from '../component/ValidatorDetails/EnhancedTable';
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
            activeValidators,
            inactiveValidators
        }
    } = useAppState();

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);

    const getDelegatedValidators = () => {
        return activeValidators.filter(valid =>
            delegatedValidatorList.some(delegated => valid?.moniker === delegated?.description?.moniker));
    }

    return (
        <React.Fragment>
            <Box sx={{
                backgroundRepeat: "repeat-x",
                backgroundPosition: "left center",
                position: "fixed",
                zIndex: -1,
                backgroundImage: "url(/banner-move.png)",
                width: "100%",
                height: "100%",
                opacity: 0.3
            }}/>
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
                        <MobileTable rows={activeValidators} viewStakedValidators search title={t("staking.allValidators")}/>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
