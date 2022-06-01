import * as React from 'react';
import {Box, Grid} from "@mui/material";
import {useTheme} from "@mui/styles";
import {useTranslation} from "react-i18next";
import ProposalCard from "../ProposalCard/ProposalCard";

export default function SummaryProposalList() {
    const theme = useTheme();
    const {t} = useTranslation();

    return (
        <Grid container spacing={{ xs: 2, md: 3 }}  sx={{ flexGrow: 1 }} >
            {/*{Array.from(Array(6)).map((_, index) => (*/}
            <Grid item xs={12} md={6} xl={12} key={1}>
                <ProposalCard
                    id={23}
                    title={"Community Spend Proposal for Creation of Terra Developer Fund"}
                    proposer={"Ali Connors"}
                    description={" — # Community Spend Proposal for Creation of Terra Developer Fund..."}
                    endingTime={"2022-05-19 17:03 UTC"}
                    mostVotedOnPercent={85}
                />
            </Grid>
            <Grid item xs={12} md={6} xl={12} key={2}>
                <ProposalCard
                    id={22}
                    title={"Increase Validator Set to 135"}
                    proposer={"to Scott, Alex, Jennifer"}
                    description={" — With Juno Network growing day-to-day, it would be nice to give new va…"}
                    endingTime={"2022-05-19 17:03 UTC"}
                    mostVotedOnPercent={97}
                />
            </Grid>
            {/*))}*/}
        </Grid>
    );
}
