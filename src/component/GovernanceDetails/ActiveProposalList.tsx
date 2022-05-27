import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {ListItemButton} from "@mui/material";

export default function SummaryProposalList() {
    return (
        <List sx={{width: '100%'}}>
            <ListItem alignItems="flex-start">
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar alt="23" src="/static/images/avatar/1.jpg"/>
                    </ListItemAvatar>
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
                </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li"/>
            <ListItem alignItems="flex-start">
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar alt="22" src="/static/images/avatar/2.jpg"/>
                    </ListItemAvatar>
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
                </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li"/>
            <ListItem alignItems="flex-start">
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar alt="21" src="/static/images/avatar/3.jpg"/>
                    </ListItemAvatar>
                    <ListItemText
                        primary="#21 Vertias Proposal Upgrade"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Sandra Adams
                                </Typography>
                                {' — Fixes an issue with governance-based IBC client updates…'}
                            </React.Fragment>
                        }
                    />
                </ListItemButton>
            </ListItem>
        </List>
    );
}
