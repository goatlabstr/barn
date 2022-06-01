import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Card, CardActionArea, CardContent, Stack} from "@mui/material";
import {useTheme} from "@mui/styles";
import CircleIcon from '@mui/icons-material/Circle';
import {useTranslation} from "react-i18next";

type ProposalCardType= {
    id: number,
    title: string,
    proposer: string,
    description: string,
    endingTime: string,
    mostVotedOnPercent: number
}

export default function ProposalCard(props: ProposalCardType) {
    const {id, title, proposer, description, endingTime, mostVotedOnPercent} = props;
    const theme = useTheme();
    const {t} = useTranslation();

    return (
        <Card>
            <CardActionArea>
                <CardContent>
                    <Stack direction={"column"} >
                        <Stack direction={"row"} spacing={2} sx={{ alignItems: "center"}}>
                            <Avatar>{id}</Avatar>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body1"
                                color="text.primary"
                            >
                                {title}
                            </Typography>
                        </Stack>
                        <p>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {proposer}
                            </Typography>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {description}
                            </Typography>
                        </p>
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Stack direction="column">
                                <Typography sx={{
                                    fontSize: 10,
                                    pr: 1,
                                    //@ts-ignore
                                    color: theme.palette.secondary.main
                                }}>{t("governance.mostVotedOn")}</Typography>
                                <Typography sx={{fontSize: 10}}><CircleIcon sx={{fontSize: 10}}
                                                                            color="success"/>{t("governance.yes", {"value": mostVotedOnPercent})}</Typography>
                            </Stack>
                            <Stack direction={"column"}>
                                <Typography variant={"body2"}
                                            sx={{
                                                fontSize: 10, pr: 1,
                                                //@ts-ignore
                                                color: theme.palette.secondary.main
                                            }}>{t("governance.votingEndTime")}</Typography>
                                <Typography variant={"body2"}
                                            sx={{
                                                fontSize: 10,
                                                //@ts-ignore
                                                color: theme.palette.primary.main
                                            }}>{endingTime}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
