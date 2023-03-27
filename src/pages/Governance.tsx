import * as React from 'react';
import {Box, Button, Grid, Tab, Tabs, Typography} from "@mui/material";
import {makeStyles, styled} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {GeneralConstants} from "../constants/general";
import {useTranslation} from "react-i18next";
import ProposalCard from "../component/ProposalCard/ProposalCard";
import {useAppSelector} from "../hooks/hook";
import {useNavigate} from "react-router-dom";

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

function Governance() {
    const classes = useStyles();
    const {t} = useTranslation();
    const [value, setValue] = React.useState(3);

    const proposals = useAppSelector(state => state.governance._.list);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const ActiveProposalContent = ({proposals}) => {
        const data = proposals.filter(proposal => proposal.status === 2).reverse();
        return <Content data={data}/>;
    }

    const PassedProposalContent = ({proposals}) => {
        const data = proposals.filter(proposal => proposal.status === 3).reverse();
        return <Content data={data}/>;
    }

    const RejectedProposalContent = ({proposals}) => {
        const data = proposals.filter(proposal => proposal.status === 4).reverse();
        return <Content data={data}/>;
    }

    const Content = ({data}) => {
        const navigate = useNavigate();
        if (data.length > 0)
            return <>
                {data.map((proposal) =>
                    <Grid item xs={12} md={6} xl={4} key={proposal?.id}>
                        <ProposalCard
                            id={proposal?.id}
                            title={proposal?.content?.value?.title || proposal?.content?.title}
                            description={proposal?.content?.value?.description || proposal?.content?.description}
                            startTime={proposal?.voting_start_time}
                            endingTime={proposal?.voting_end_time}
                            proposal={proposal}
                            onClick={() => navigate("/governance/" + proposal?.id)}
                        />
                    </Grid>)}
            </>
        else
            return <Grid item xs={12}>
                <Box textAlign={"center"} >{t("governance.noActiveProposal")}</Box>
            </Grid>
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
            <Box sx={{
                width: "100%",
                pt: 2
            }} className={classes.centerBox}>
                <Box className={classes.centerInnerBox}>
                    <StyledTabs value={value} onChange={handleChange}>
                        <StyledTab label={t("governance.active")}/>
                        <StyledTab label={t("governance.passed")}/>
                        <StyledTab label={t("governance.rejected")}/>
                        <StyledTab label={t("governance.all")}/>
                    </StyledTabs>
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={{xs: 1, md: 2}} sx={{flexGrow: 1}}>
                            <ActiveProposalContent proposals={proposals}/>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container spacing={{xs: 1, md: 2}} sx={{flexGrow: 1}}>
                            <PassedProposalContent proposals={proposals}/>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Grid container spacing={{xs: 1, md: 2}} sx={{flexGrow: 1}}>
                            <RejectedProposalContent proposals={proposals}/>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Grid container spacing={{xs: 1, md: 2}} sx={{flexGrow: 1}}>
                            <Content data={([...proposals].reverse())}/>
                        </Grid>
                    </TabPanel>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default Governance;
