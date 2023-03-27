import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import TokenDetails from '../component/TokenDetails/index';
import {makeStyles, useTheme} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {GeneralConstants} from "../constants/general";
import EnhancedTable from "../component/ValidatorDetails/EnhancedTable";
import {useNavigate} from "react-router-dom";
import ProposalList from "../component/GovernanceDetails/ProposalList";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../hooks/hook";
import {useAppState} from "../hooks/useAppState";
import MobileTable from "../component/ValidatorDetails/Mobile/MobileTable";

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        justifyContent: "center"
    },
    centerInnerBox: {
        width: GeneralConstants.mainContent.width
    }
}));


function Dashboard() {
    const {t} = useTranslation();
    const classes = useStyles();
    let navigate = useNavigate();
    const theme = useTheme();
    const [activeProposals, setActiveProposals] = useState<typeof proposals>([]);
    const {
        appState: {
            activeValidators,
            inactiveValidators
        },
    } = useAppState();

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const proposals = useAppSelector(state => state.governance._.list);

    const getDelegatedValidators = () => {
        return activeValidators.concat(inactiveValidators).filter(valid =>
            delegatedValidatorList.some(delegated => valid?.moniker === delegated?.description?.moniker));
    }

    useEffect(() => {
        if (proposals)
            setActiveProposals(proposals.filter((proposal) => proposal.status === 2).reverse());
    }, [proposals]);

    return (
        <React.Fragment>
            <Box sx={{
                backgroundRepeat: "no-repeat",
                // backgroundSize: "cover",
                backgroundPosition: "right center",
                position: "fixed",
                right: "0%",
                bottom: "-10%",
                zIndex: -1,
                backgroundImage: "url(/city-man.png)",
                width: "100%",
                height: "100%",
                opacity: 0.3
            }}/>
            <Box sx={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center",
                position: "fixed",
                // right: "0%",
                // bottom: "-20%",
                zIndex: -1,
                backgroundImage: "url(/banner-move.png)",
                width: "100%",
                height: "100%",
                opacity: 0.3
            }}/>
            <Grid container>
                <Grid item xs={12} xl={12}>
                    <Box sx={{
                        width: "100%",
                        height: "auto",
                        //@ts-ignore
                        backgroundColor: theme.palette.background.dark,
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <TokenDetails/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} xl={9}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Box sx={{display: {xs: "none", md: 'block'}}}>
                                <EnhancedTable rows={getDelegatedValidators()}
                                               title={t("dashboard.stakedValidators")}
                                               buttonTitle={t("dashboard.viewAll")}
                                               onClickToolbarButton={() => {
                                                   navigate("/stake")
                                               }}
                                               search={false}
                                />
                            </Box>
                            <Box sx={{display: {xs: "block", md: 'none'}}}>
                                <MobileTable rows={getDelegatedValidators()}
                                             title={t("dashboard.stakedValidators")}
                                             buttonTitle={t("dashboard.viewAll")}
                                             onClickToolbarButton={() => {
                                                 navigate("/stake")
                                             }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} xl={3}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Stack direction="row" justifyContent={"space-between"} spacing={1} mb={1.5}>
                                <Typography variant={"h6"}>{t("dashboard.activeProposal")}</Typography>
                                <Button variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate("/governance")}>{t("dashboard.viewAll")}</Button>
                            </Stack>
                            <ProposalList data={activeProposals}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Dashboard;
