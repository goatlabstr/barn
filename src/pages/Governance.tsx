import * as React from 'react';
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import {styled} from "@mui/styles";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
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
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))(({ theme }) => ({
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
))(({ theme }) => ({
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

function Index() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Box  sx={{
                        width: "100%",
                        p: 2
                    }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <StyledTabs value={value} onChange={handleChange} aria-label="lab API tabs example">
                                    <StyledTab label="Active" />
                                    <StyledTab label="Passed" />
                                    <StyledTab label="Rejected" />
                                    <StyledTab label="All" />
                                </StyledTabs>
                            </Box>
                        <TabPanel value={value} index={0}>
                            Active Proposals
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            Passed Proposals
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Rejected Proposals
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            All Proposals
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
