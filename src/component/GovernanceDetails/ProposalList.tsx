import * as React from 'react';
import {Box, Grid} from "@mui/material";
import {useTheme} from "@mui/styles";
import {useTranslation} from "react-i18next";
import ProposalCard from "../ProposalCard/ProposalCard";

type ProposalProps = {
    data: any;
    details: any;
}

export default function ProposalList(props: ProposalProps) {
    const {data, details} = props;
    const theme = useTheme();
    const {t} = useTranslation();

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

    const getProposalContent = (data) => {
        if (data.length > 0)
            return <>
                {data.map((proposal) =>
                    <Grid item xs={12} md={6} xl={12} key={proposal?.id}>
                        <ProposalCard
                            id={proposal?.id}
                            title={proposal?.content?.value?.title}
                            proposer={(getProposer(proposal, details))}
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
        <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
            {
                getProposalContent(data)
            }
        </Grid>
    );
}
