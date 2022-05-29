import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {ListItemButton, Stack} from "@mui/material";
import {useTheme} from "@mui/styles";
import CircleIcon from '@mui/icons-material/Circle';
import {useTranslation} from "react-i18next";

export default function SummaryProposalList() {
    const theme = useTheme();
    const {t} = useTranslation();

    return (
        <List sx={{width: '100%'}}>
            <ListItem alignItems="flex-start">
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar alt="23" src="/static/images/avatar/1.jpg"/>
                    </ListItemAvatar>
                    <Stack direction={"column"}>
                        <ListItemText
                            primary="#23 Community Spend Proposal for Creation of Terra Developer Fund"
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Ali Connors
                                    </Typography>
                                    {" — # Community Spend Proposal for Creation of Terra Developer Fund..."}
                                </React.Fragment>
                            }
                        />
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Stack direction="column">
                                <Typography sx={{
                                    fontSize: 10,
                                    pr: 1,
                                    //@ts-ignore
                                    color: theme.palette.secondary.main
                                }}>{t("governance.mostVotedOn")}</Typography>
                                <Typography sx={{fontSize: 10}}><CircleIcon sx={{fontSize: 10}}
                                                                            color="success"/>{t("governance.yes", {"value": 85})}</Typography>
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
                                            }}>2022-05-19 17:03 UTC</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li"/>
            <ListItem alignItems="flex-start">
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar alt="22" src="/static/images/avatar/2.jpg"/>
                    </ListItemAvatar>
                    <Stack direction={"column"}>
                        <ListItemText
                            primary="#22 Increase Validator Set to 135"
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        to Scott, Alex, Jennifer
                                    </Typography>
                                    {" — With Juno Network growing day-to-day, it would be nice to give new va…"}
                                </React.Fragment>
                            }
                        />
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Stack direction="column">
                                <Typography sx={{
                                    fontSize: 10,
                                    pr: 1,
                                    //@ts-ignore
                                    color: theme.palette.secondary.main
                                }}>{t("governance.mostVotedOn")}</Typography>
                                <Typography sx={{fontSize: 10}}><CircleIcon sx={{fontSize: 10}}
                                                                            color="success"/>{t("governance.yes", {"value": 97})}</Typography>
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
                                            }}>2022-05-19 17:03 UTC</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </ListItemButton>
            </ListItem>
        </List>
    );
}
