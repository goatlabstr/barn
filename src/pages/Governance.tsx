import * as React from 'react';
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {GeneralConstants} from "../constants/general";
import {useTranslation} from "react-i18next";
import ProposalCard from "../component/ProposalCard/ProposalCard";
import {useAppSelector} from "../customHooks/hook";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{children: <span className="MuiTabs-indicatorSpan"/>}}
    />
))(({theme}) => ({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 75,
        width: '100%',
        //@ts-ignore
        backgroundColor: theme.palette.secondary.main,
    },
}));

interface StyledTabProps {
    label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(({theme}) => ({
    textTransform: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        //@ts-ignore
        color: theme.palette.secondary.main,
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));

const useStyles = makeStyles((theme: Theme) => ({
    centerBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    centerInnerBox: {
        width: GeneralConstants.mainContent.width
    }
}));

function Index() {
    const classes = useStyles();
    const {t} = useTranslation();
    const [value, setValue] = React.useState(0);


    const proposals = useAppSelector(state => state.governance._.list);
    const proposalDetails = useAppSelector(state => state.governance.proposalDetails.value);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getProposer = (proposal, proposalDetails) => {
        let proposer = proposal.proposer;
        proposalDetails && Object.keys(proposalDetails).length &&
        Object.keys(proposalDetails).filter((key) => {
            if (key === proposal.id) {
                if (proposalDetails[key] &&
                    proposalDetails[key][0] &&
                    proposalDetails[key][0]?.tx?.value?.msg[0]?.value?.proposer) {
                    proposer = proposalDetails[key][0]?.tx?.value?.msg[0]?.value?.proposer;
                }
            }
            return null;
        });
        return proposer;
    }

    const getActiveProposalContent = (proposals) => {
        const data = proposals.filter(proposal => proposal.status === 2).reverse();
        return getContent(data);
    }

    const getPassedProposalContent = (proposals) => {
        const data = proposals.filter(proposal => proposal.status === 3).reverse();
        return getContent(data);
    }

    const getRejectedProposalContent = (proposals) => {
        const data = proposals.filter(proposal => proposal.status === 4).reverse();
        return getContent(data);
    }

    const getContent = (data) => {
        if (data.length > 0)
            return <>
                {data.map((proposal) =>
                    <Grid item xs={12} md={6} xl={4} key={proposal?.id}>
                        <ProposalCard
                            id={proposal?.id}
                            title={proposal?.content?.value?.title}
                            proposer={(getProposer(proposal, proposalDetails))}
                            description={proposal?.content?.value?.description}
                            startTime={proposal?.voting_start_time}
                            endingTime={proposal?.voting_end_time}
                            proposal={proposal}
                        />
                    </Grid>)}
            </>
        else
            return <Grid item xs={12} md={6} xl={12} >
                <Box textAlign={"center"} sx={{color: "rgb(131 157 170)"}}>{t("governance.noActiveProposal")}</Box>
            </Grid>
    }

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Box sx={{
                        width: "100%",
                        p: 2
                    }} className={classes.centerBox}>
                        <Box className={classes.centerInnerBox}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <StyledTabs value={value} onChange={handleChange} aria-label="lab API tabs example">
                                    <StyledTab label={t("governance.active")}/>
                                    <StyledTab label={t("governance.passed")}/>
                                    <StyledTab label={t("governance.rejected")}/>
                                    <StyledTab label={t("governance.all")}/>
                                </StyledTabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
                                    {
                                        getActiveProposalContent(proposals)
                                    }
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
                                    {
                                        getPassedProposalContent(proposals)
                                    }
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
                                    {
                                        getRejectedProposalContent(proposals)
                                    }
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
                                    {
                                        getContent([...proposals].reverse())
                                    }
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
