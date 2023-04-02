import React, {useEffect, useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {Theme} from "@mui/material/styles";

import {
    Tooltip as MTooltip, Stack, Typography, Paper, Grid, Box, Chip, Toolbar, IconButton, AppBar, Button, Avatar
}
    from "@mui/material";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles, useTheme} from "@mui/styles";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {useAppDispatch, useAppSelector} from "../../hooks/hook";
import {tally} from "../ProposalCard/ProposalCard";
import allActions from "../../action";
import {useParams} from "react-router";
import {useDialog} from "../../hooks/use-dialog/DialogContext";
import VotingDialog from "./VotingDialog";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        margin: theme.spacing(1)
    },
    backButton: {
        [theme.breakpoints.down('md')]: {
            display: "none",
        }
    },
    typo: {
        fontSize: 13,
        [theme.breakpoints.down('xl')]: {
            fontSize: 12,
        }
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const VotingDate = ({date, title}) => {
    const classes = useStyles();
    const theme = useTheme();

    return (<Box>
        <Typography variant={"body2"}
                    className={classes.typo}
                    sx={{
                        pr: 1,
                        //@ts-ignore
                        color: theme.palette.secondary.main
                    }}>{title}</Typography>
        <Typography variant={"body2"}
                    className={classes.typo}>{new Date(date).toLocaleString()}</Typography>
    </Box>)
}

const StatusIcon = ({status}) => {
    const {t} = useTranslation();
    switch (status) {
        case 2:
        case "PROPOSAL_STATUS_VOTING_PERIOD" :
            return <MTooltip title={t("governance.votingMessage")}><Chip label={t("governance.active")}
                                                                         sx={{
                                                                             backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                                             color: "#fff",
                                                                             marginTop: 2
                                                                         }}/></MTooltip>
        case 3:
        case "PROPOSAL_STATUS_PASSED":
            return <MTooltip title={t("governance.passedMessage")}><Chip label={t("governance.passed")}
                                                                         sx={{
                                                                             backgroundColor: "#66bb6a",
                                                                             color: "#fff",
                                                                             marginTop: 2
                                                                         }}/></MTooltip>
        case 4:
        case "PROPOSAL_STATUS_REJECTED":
            return <MTooltip title={t("governance.rejectedMessage")}><Chip label={t("governance.rejected")}
                                                                           sx={{
                                                                               backgroundColor: "#f44336",
                                                                               color: "#fff",
                                                                               marginTop: 2
                                                                           }}/></MTooltip>
        default:
            return <MTooltip title={t("governance.unknownMessage")}><Chip label={t("governance.unknown")}
                                                                          sx={{
                                                                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                                              color: "#fff",
                                                                              marginTop: 2
                                                                          }}/></MTooltip>
    }
}

const VoteStatus = ({status}) => {
    const {t} = useTranslation();
    switch (status) {
        case 1:
        case "VOTE_OPTION_YES":
            return <Chip label={t("governance.voted.yes")}
                         sx={{
                             backgroundColor: "transparent",
                             color: "#D1B000",
                             marginTop: 2
                         }}/>
        case 2:
        case "VOTE_OPTION_ABSTAIN":
            return <Chip label={t("governance.voted.abstain")}
                         sx={{
                             backgroundColor: "transparent",
                             color: "#D1B000",
                             marginTop: 2
                         }}/>
        case 3:
        case "VOTE_OPTION_NO":
            return <Chip label={t("governance.voted.no")}
                         sx={{
                             backgroundColor: "transparent",
                             color: "#D1B000",
                             marginTop: 2
                         }}/>
        case 4:
        case "VOTE_OPTION_NO_WITH_VETO":
            return <Chip label={t("governance.voted.noWithVeto")}
                         sx={{
                             backgroundColor: "transparent",
                             color: "#D1B000",
                             marginTop: 2
                         }}/>
        default:
            return <></>;
    }
}

export default function VotingDetails() {
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {id} = useParams();
    const navigate = useNavigate();
    const {openDialog, closeDialog} = useDialog();

    const address = useAppSelector(state => state.accounts.address.value);
    const voteDetails = useAppSelector(state => state.governance.voteDetails.value);
    const tallyDetails = useAppSelector(state => state.governance.tallyDetails.value);
    const proposals = useAppSelector(state => state.governance._.list);

    const [proposal, setProposal] = useState<typeof proposals>(null);

    useEffect(() => {
        const prop = proposals.filter(item => item?.proposal_id == id).pop();
        if (prop)
            setProposal(prop);
    }, [proposals])

    const getVoteStatus = (proposal) => {
        const proposalId = proposal?.id ? proposal?.id : proposal?.proposal_id;
        //@ts-ignore
        return voteDetails?.find(vote => vote?.proposal_id == proposalId)?.option;
    }

    const voteCalculation = (proposal, vote) => {
        if (proposal?.status === 2 || proposal?.status === "PROPOSAL_STATUS_VOTING_PERIOD") {
            const proposalId = proposal?.id ? proposal?.id : proposal?.proposal_id;
            const value = tallyDetails && tallyDetails[proposalId];
            // @ts-ignore
            const sum = (parseInt(value?.yes) + parseInt(value?.no) + parseInt(value?.no_with_veto) + parseInt(value?.abstain));

            return (tallyDetails && tallyDetails[proposalId] && tallyDetails[proposalId][vote]
                ? tally(tallyDetails[proposalId][vote], sum) : 0);
        } else {
            const sum = parseInt(proposal?.final_tally_result.yes) + parseInt(proposal?.final_tally_result.no) +
                parseInt(proposal?.final_tally_result.no_with_veto) + parseInt(proposal?.final_tally_result.abstain);

            return (proposal?.final_tally_result[vote]
                ? tally(proposal?.final_tally_result[vote], sum) : 0);
        }
    };

    const handleData = (proposal, t) => {
        const yes = voteCalculation(proposal, 'yes');
        const no = voteCalculation(proposal, 'no');
        const no_with_veto = voteCalculation(proposal, 'no_with_veto');
        const abstain = voteCalculation(proposal, 'abstain');
        const data = {
            labels: [t("governance.yes", {"value": yes}),
                t("governance.no", {"value": no}),
                t("governance.no_with_veto", {"value": no_with_veto}),
                t("governance.abstain", {"value": abstain})],
            datasets: [
                {
                    label: "# of Votes",
                    data: [yes, no, no_with_veto, abstain],
                    backgroundColor: [
                        "#66bb6a",
                        "rgba(255, 255, 255, 0.3)",
                        "#f44336",
                        "#ffa726",
                    ],
                    borderWidth: 0.5
                }
            ]
        };

        return data;
    };

    useEffect(() => {
        if (proposal) {
            const proposalId = proposal?.id ? proposal?.id : proposal?.proposal_id;
            dispatch(allActions.fetchVoteDetails(proposalId, address))
        }
    }, [proposal, address]);

    return (
        <>
            <Grid container sx={{p: 3}}>
                <Grid item>
                    <Stack direction="row">
                        <IconButton
                            onClick={() => navigate(-1)}
                            className={classes.backButton}><ArrowBackIcon/></IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {proposal ? ("#" + (proposal?.id ? proposal?.id : proposal?.proposal_id) + " " + proposal?.content?.title) : "#Proposal"}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item sx={{alignItems: "center"}} xs={12}>
                    <Stack direction="column" sx={{alignItems: "center"}}>
                        {proposal?.content?.value?.msg?.image_url &&
                            <img style={{height: 250}}
                                 src={proposal?.content?.value?.msg?.image_url}/>
                        }
                        <Stack direction="column" pt={2} spacing={2}>
                            <Box sx={{width: 250, textAlign: "center"}}>
                                <Doughnut data={handleData(proposal, t)}/>
                                <StatusIcon status={proposal?.status}/>
                                <VoteStatus status={getVoteStatus(proposal)}/>
                            </Box>
                            {(proposal?.status === 2 || proposal?.status === "PROPOSAL_STATUS_VOTING_PERIOD") &&
                                <Button variant={"contained"}
                                        color="secondary"
                                        onClick={() => openDialog(
                                            <VotingDialog proposal={proposal}/>,
                                            "#" + (proposal?.id ? proposal?.id : proposal?.proposal_id) + " " + proposal?.content?.title)}
                                >{t("vote")}</Button>}
                        </Stack>
                        <Stack direction="row" sx={{marginTop: 2}} spacing={4}>
                            <VotingDate date={proposal?.submit_time} title={t("governance.submitTime")}/>
                            <VotingDate date={proposal?.deposit_end_time}
                                        title={t("governance.depositEndTime")}/>
                            <VotingDate date={proposal?.voting_start_time}
                                        title={t("governance.votingStartTime")}/>
                            <VotingDate date={proposal?.voting_end_time} title={t("governance.votingEndTime")}/>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} sx={{padding: 3}}>
                    <Typography variant={"h6"}>Description</Typography>
                    <Typography paragraph
                                sx={{whiteSpace: "pre-wrap"}}>{proposal?.content?.description}</Typography>
                </Grid>
            </Grid>
        </>
    );

}
