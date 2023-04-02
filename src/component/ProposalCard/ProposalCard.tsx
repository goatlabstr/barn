import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Card, CardActionArea, CardContent, Stack, Tooltip} from "@mui/material";
import {makeStyles, useTheme} from "@mui/styles";
import CircleIcon from '@mui/icons-material/Circle';
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../hooks/hook";
import {
    Cancel as RejectedStatusIcon,
    CheckCircle as ApprovedStatusIcon,
    Help as UnknownStatusIcon,
    Timer as WaitingStatusIcon
} from "@mui/icons-material/";
import {Theme} from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => ({
    typo: {
        fontSize: 10,
        [theme.breakpoints.down('xl')]: {
            fontSize: 10,
        }
    }
}));

type ProposalCardType = {
    id: number,
    title: string,
    description: string,
    startTime: string,
    endingTime: string,
    proposal: any,
    onClick?: any
}

export const tally = (value, sum) => {
    const total = (value / sum) * 100;
    if (value === 0 && sum === 0) {
        return 0;
    }

    return total.toFixed(2);
};

export default function ProposalCard(props: ProposalCardType) {
    const {id, title, description, startTime, endingTime, proposal, onClick} = props;
    const theme = useTheme();
    const {t} = useTranslation();
    const classes = useStyles();

    const tallyDetails = useAppSelector(state => state.governance.voteDetails.value);

    const voteCalculation = (proposal, val) => {
        if (proposal?.status === 2 || proposal?.status === "PROPOSAL_STATUS_VOTING_PERIOD") {
            const value = tallyDetails && tallyDetails[proposal.id];
            // @ts-ignore
            const sum = (parseInt(value?.yes) + parseInt(value?.no) + parseInt(value?.no_with_veto) + parseInt(value?.abstain));

            return (tallyDetails && tallyDetails[proposal.id] && tallyDetails[proposal.id][val]
                ? tally(tallyDetails[proposal.id][val], sum) : 0);
        } else {
            const sum = parseInt(proposal?.final_tally_result.yes) + parseInt(proposal?.final_tally_result.no) +
                parseInt(proposal?.final_tally_result.no_with_veto) + parseInt(proposal?.final_tally_result.abstain);

            return (proposal?.final_tally_result[val]
                ? tally(proposal?.final_tally_result[val], sum) : 0);
        }
    };

    const getVoteTypo = (vote, proposal) => {
        switch (vote) {
            case 'yes':
                return <Typography className={classes.typo}><CircleIcon className={classes.typo}
                                                                        color="success"/>{t("governance.yes", {"value": voteCalculation(proposal, vote)})}
                </Typography>
            case 'no':
                return <Typography className={classes.typo}><CircleIcon className={classes.typo}
                                                                        color="disabled"/>{t("governance.no", {"value": voteCalculation(proposal, vote)})}
                </Typography>
            case 'no_with_veto':
                return <Typography className={classes.typo}><CircleIcon className={classes.typo}
                                                                        color="error"/>{t("governance.no_with_veto", {"value": voteCalculation(proposal, vote)})}
                </Typography>
            case 'abstain':
            default:
                return <Typography className={classes.typo}><CircleIcon className={classes.typo}
                                                                        color="warning"/>{t("governance.abstain", {"value": voteCalculation(proposal, vote)})}
                </Typography>
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 2 :
            case "PROPOSAL_STATUS_VOTING_PERIOD" :
                return <Tooltip title={t("governance.votingMessage")}><WaitingStatusIcon color="action"/></Tooltip>
            case 3:
            case "PROPOSAL_STATUS_PASSED":
                return <Tooltip title={t("governance.passedMessage")}><ApprovedStatusIcon color="success"/></Tooltip>
            case 4:
            case "PROPOSAL_STATUS_REJECTED":
                return <Tooltip title={t("governance.rejectedMessage")}><RejectedStatusIcon color="error"/></Tooltip>
            default:
                return <Tooltip title={t("governance.unknownMessage")}><UnknownStatusIcon color="disabled"/></Tooltip>
        }
    }

    return (
        <CardActionArea onClick={onClick}>
            <Card sx={{minHeight: 200}}>
                <CardContent sx={{height: "100%"}}>
                    <Stack direction={"column"} spacing={2}>
                        <Stack direction={"row"} spacing={2} sx={{alignItems: "center"}}
                               justifyContent={"space-between"}>
                            <Avatar sx={{
                                color: "white",
                                background: "linear-gradient(135deg, rgba(136,14,79,1) 15%, rgba(26,35,126,1) 100%)"
                            }}>{id}</Avatar>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body1"
                                color="text.primary"
                            >
                                {title}
                            </Typography>
                            {getStatusIcon(proposal?.status)}
                        </Stack>
                        <Typography
                            sx={{
                                display: 'inline',
                                mb: 1,
                                mt: 1
                            }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                        >
                            {description && description.length >= 100 ? description.slice(0, 100) + "..." : description}
                        </Typography>
                        <Stack direction="column" sx={{justifyContent: "space-between"}}>
                            <Stack direction="row" sx={{mb: 1, justifyContent: "space-between"}}>
                                {getVoteTypo('yes', proposal)}
                                {getVoteTypo('no', proposal)}
                                {getVoteTypo('no_with_veto', proposal)}
                                {getVoteTypo('abstain', proposal)}
                            </Stack>
                            <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"}
                                                className={classes.typo}
                                                sx={{
                                                    pr: 1,
                                                    //@ts-ignore
                                                    color: theme.palette.secondary.main
                                                }}>{t("governance.votingStartTime")}</Typography>
                                    <Typography variant={"body2"}
                                                className={classes.typo}
                                                sx={{
                                                    //@ts-ignore
                                                    color: theme.palette.primary.main
                                                }}>{new Date(startTime).toLocaleString()}</Typography>
                                </Stack>
                                <Stack direction={"column"}>
                                    <Typography variant={"body2"}
                                                className={classes.typo}
                                                sx={{
                                                    pr: 1,
                                                    //@ts-ignore
                                                    color: theme.palette.secondary.main
                                                }}>{t("governance.votingEndTime")}</Typography>
                                    <Typography variant={"body2"}
                                                className={classes.typo}
                                                sx={{
                                                    //@ts-ignore
                                                    color: theme.palette.primary.main
                                                }}>{new Date(endingTime).toLocaleString()}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </CardActionArea>
    );
}
