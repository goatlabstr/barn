import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";
import {Avatar, InputAdornment, Stack, SwipeableDrawer, Typography} from "@mui/material";
import {useAppState} from "../../../hooks/useAppState";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Common from "../../../services/axios/common";
import {networkName} from "../../../constants/networkConfig";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {darken, lighten, styled} from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

const GroupHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    zIndex: 1,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

export default function NetworkSelect({type = "medium"}: { type?: "medium" | "small" | "large" | undefined }) {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [network, setNetwork] = React.useState<object | null>(null);
    const {
        appState: {
            chainInfo,
            currentPrice
        }
    } = useAppState();
    const [chainConfigs, setSupportedChainConfigs] = useState([]);
    const [searchResult, setSearchResult] = React.useState<any>([]);
    const [searchText, setSearchText] = React.useState<string>("");

    useEffect(() => {
        Common.getAllChainsInfo().then(resp => {
            const chainsData = resp?.data?.chains;
            setSupportedChainConfigs(chainsData);
            //@ts-ignore
            const filteredChainData = chainsData?.filter(o => o?.name === networkName);
            if (filteredChainData !== undefined && filteredChainData.length > 0)
                setNetwork(filteredChainData[0]);
        });
    }, [])

    useEffect(() => {
        if (chainConfigs) {
            setSearchResult(chainConfigs);
            setSearchText("");
        }
    }, [chainConfigs])

    useEffect(() => {
        if (searchText === "") {
            setSearchResult(chainConfigs);
        } else if (chainConfigs && searchText) {
            //@ts-ignore
            setSearchResult(chainConfigs.filter(conf => conf?.pretty_name?.toLowerCase()?.includes(searchText?.toLowerCase())));
        }
    }, [searchText])

    const handleSearchText = (search: string) => {
        setSearchText(search);
    }
    const handleChange = (network: object | null) => {
        setNetwork(network);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpen(false);
    };

    const handleSwitch = (event: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
            //@ts-ignore
            window.location.href = window.location.origin + "/" + network?.name;
        }
    };

    const onNetworkSwitch = (network) => {
        setOpen(false);
        //@ts-ignore
        window.location.href = window.location.origin + "/" + network?.name;
    };

    const NetworkDialog = () => {
        return (
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Switch Network</DialogTitle>
                <DialogContent>
                    <Stack direction={"row"} alignItems={"center"} sx={{p: 1}}>
                        {network && <Avatar
                            sx={{width: 35, height: 35, ml: 1, mr: 1.5}}
                            //@ts-ignore
                            src={network?.image}
                        />}
                        <Autocomplete
                            id="switch-network-auto-complete"
                            //@ts-ignore
                            options={chainConfigs.sort((a, b) => b?.status.localeCompare(a?.status))}
                            //@ts-ignore
                            groupBy={(option) => option?.network_type}
                            renderGroup={(params) => (
                                <li key={params.key}>
                                    <GroupHeader>{params.group}</GroupHeader>
                                    <GroupItems>{params.children}</GroupItems>
                                </li>
                            )}
                            //@ts-ignore
                            getOptionLabel={(option) => option?.name}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                    <Stack direction={"row"}>
                                        <Avatar
                                            sx={{width: 30, height: 30, ml: 1, mr: 1.5, zIndex: 0}}
                                            //@ts-ignore
                                            src={option?.image}
                                        />
                                    </Stack>
                                    <Typography variant={"subtitle1"}>
                                        {//@ts-ignore
                                            option?.pretty_name}
                                    </Typography>
                                </Box>
                            )}
                            fullWidth
                            value={network}
                            onChange={(event: any, newValue: object | null) => {
                                handleChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Network"/>}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t("cancel")}</Button>
                    <Button disabled={!network} onClick={handleSwitch}>{t("switch")}</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const NetworkDrawer = () => {
        return (
            <SwipeableDrawer
                anchor={"bottom"}
                open={open}
                onClose={handleClose}
                onOpen={handleClickOpen}
            >
                <Paper
                    component="form"
                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%"}}
                >
                    <Box sx={{p: '10px'}}>
                        <SearchIcon/>
                    </Box>
                    <InputBase
                        sx={{ml: 1, flex: 1}}
                        placeholder="Search Networks"
                        inputProps={{'aria-label': 'search networks'}}
                        value={searchText}
                        autoFocus
                        onChange={(e) => handleSearchText(e.target.value)}
                    />
                </Paper>
                <Box sx={{width: '100%', maxHeight: 300, overflowY: "scroll", bgcolor: 'background.paper'}}>
                    <List>
                        {//@ts-ignore
                            searchResult.sort((a, b) => b?.status.localeCompare(a?.status)).map(config => (
                                <ListItem disablePadding onClick={() => onNetworkSwitch(config)}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Avatar
                                                sx={{width: 32, height: 32, ml: 1, mr: 1.5, zIndex: 0}}
                                                //@ts-ignore
                                                src={config?.image}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            //@ts-ignore
                                            primary={config?.pretty_name}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                    </List>
                </Box>
            </SwipeableDrawer>
        )
    }

    return (
        <div>
            <Button onClick={handleClickOpen} color="inherit"
                    size={type}>
                <Stack direction="row" alignItems={"center"} spacing={0.15}>
                    {//@ts-ignore
                        chainInfo?.image && <Avatar sx={{width: 30, height: 30}} src={chainInfo?.image}/>
                    }
                    <Stack direction="column" spacing={-0.35}>
                        <Box
                            //@ts-ignore
                            sx={{fontSize: 9, textAlign: "left"}}>{chainInfo?.pretty_name}</Box>
                        <Box sx={{fontSize: 7, color: "rgb(131 157 170)", textAlign: "left"}}>
                            ${currentPrice}
                        </Box>
                    </Stack>
                    <KeyboardArrowDownIcon sx={{color: "rgb(131 157 170)"}} fontSize={"small"}/>
                </Stack>
                <NetworkDrawer key={"network-switch-drawer"}/>
            </Button>

        </div>
    );
}