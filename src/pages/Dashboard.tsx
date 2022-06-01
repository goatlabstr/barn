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
import {useAppSelector} from "../customHooks/hook";

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        justifyContent: "center"
    },
    centerInnerBox: {
        width: GeneralConstants.mainContent.width
    }
}));


function Index() {
    const {t} = useTranslation();
    const classes = useStyles();
    let navigate = useNavigate();
    const theme = useTheme();
    const [activeProposals, setActiveProposals] = useState<typeof proposals>([]);

    const delegatedValidatorList = useAppSelector(state => state.stake.delegatedValidators.list);
    const validatorImages = useAppSelector(state => state.stake.validators.images);
    const proposals = useAppSelector(state => state.governance._.list);
    const proposalDetails = useAppSelector(state => state.governance.proposalDetails.value);

    useEffect(() => {
        if (proposals)
            setActiveProposals(proposals.filter((proposal) => proposal.status === 2));
    }, [proposals]);

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
                <Grid item md={12} xl={8}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <EnhancedTable rows={delegatedValidatorList}
                                           images={validatorImages}
                                           title={t("dashboard.stakedValidators")}
                                           buttonTitle={t("dashboard.viewAll")}
                                           onClickToolbarButton={() => {
                                               navigate("/stake")
                                           }}
                                           search
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={12} xl={4}>
                    <Box sx={{
                        width: "100%",
                        p: 3
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Stack direction="row" justifyContent={"space-between"} spacing={1} mb={1.5}>
                                <Typography variant={"subtitle1"}>{t("dashboard.activeProposal")}</Typography>
                                <Button variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate("/governance")}>{t("dashboard.viewAll")}</Button>
                            </Stack>
                            <ProposalList data={activeProposals} details={proposalDetails}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
