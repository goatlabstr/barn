import * as React from 'react';
import {Box, Button, Grid} from "@mui/material";
import {useTheme} from "@mui/styles";
import {useTranslation} from "react-i18next";
import ProposalCard from "../ProposalCard/ProposalCard";
import VotingDialog from "./VotingDetails";
import {useDialog} from "../../hooks/use-dialog/DialogContext";
import {useNavigate} from "react-router-dom";

type ProposalProps = {
    data: any;
}

export default function ProposalList(props: ProposalProps) {
    const {data} = props;
    const {t} = useTranslation();

    const ProposalContent = ({data}) => {
        const navigate = useNavigate();

        if (data.length > 0)
            return <>
                {data.map((proposal) =>
                    <Grid item xs={12} md={6} lg={12} key={proposal?.id}>
                        <ProposalCard
                            id={proposal?.id}
                            title={proposal?.content?.value?.title || proposal?.content?.title}
                            description={proposal?.content?.value?.description || proposal?.content?.description}
                            startTime={proposal?.voting_start_time}
                            endingTime={proposal?.voting_end_time}
                            proposal={proposal}
                            onClick={() => navigate("/governance-" + proposal?.id)}
                        />
                    </Grid>)}
            </>
        else
            return <Grid item xs={12}>
                <Box textAlign={"center"} >{t("governance.noActiveProposal")}</Box>
            </Grid>
    }

    return (
        <Grid container spacing={{xs: 2, md: 3}} sx={{flexGrow: 1}}>
            <ProposalContent data={data} />
        </Grid>
    );
}
