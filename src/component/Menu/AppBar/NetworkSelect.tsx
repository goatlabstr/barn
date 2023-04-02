import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useTranslation} from "react-i18next";
import {Avatar, Chip, DialogContent, Stack, SwipeableDrawer} from "@mui/material";
import {useAppState} from "../../../hooks/useAppState";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Common from "../../../services/axios/common";
import {darken, lighten, styled} from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useDialog} from "../../../hooks/use-dialog/DialogContext";
import {useWindowSize} from "../../../hooks/window/use-window-size";

const NetworkSelectPopupContent = ({onNetworkSwitch, chainConfigs, getLastViewedNetworks}) => {
    const [searchResult, setSearchResult] = React.useState<any>([]);
    const [searchText, setSearchText] = React.useState<string>("");

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
            const filteredData = chainConfigs.filter(conf => conf?.pretty_name?.toLowerCase()?.includes(searchText?.toLowerCase()));
            setSearchResult(filteredData);
        }
    }, [searchText])

    const handleSearchText = (e) => {
        setSearchText(e.target.value);
    }

    return (<>
        <Paper
            key={"network-select-drawer-paper"}
            component="form"
            sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%"}}
        >
            <Box sx={{p: '10px'}}>
                <SearchIcon/>
            </Box>
            <InputBase
                key={"network-select-drawer-input"}
                sx={{ml: 1, flex: 1}}
                placeholder="Search Networks"
                inputProps={{'aria-label': 'search networks'}}
                value={searchText}
                autoFocus
                onChange={handleSearchText}
            />
        </Paper>
        <Stack direction={"row"} spacing={1}
               sx={{width: '100%', p: 1, overflowX: "scroll", bgcolor: 'background.paper'}}>
            {getLastViewedNetworks().map(c => (
                <Chip avatar={<Avatar //@ts-ignore
                    src={c?.image}
                />}
                    //@ts-ignore
                      label={c?.pretty_name}
                    //@ts-ignore
                      onClick={() => onNetworkSwitch(c?.name)}
                      variant="outlined"/>))}
        </Stack>
        <Box sx={{width: '100%', maxHeight: 300, overflowY: "scroll", bgcolor: 'background.paper'}}>
            <List>
                {//@ts-ignore
                    searchResult.sort((a, b) => b?.status.localeCompare(a?.status)).map(config => (
                        <ListItem disablePadding onClick={() => onNetworkSwitch(config?.name)}>
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
        </Box></>)
}

const NetworkDialogContent = (props) => {
    return (
        <DialogContent sx={{p: 0}}>
            <NetworkSelectPopupContent {...props}/>
        </DialogContent>
    );
}
const NetworkDrawer = (props) => {
    return (
        <SwipeableDrawer
            key={"network-select-drawer"}
            anchor={"bottom"}
            open={props.open}
            onClose={props.handleClose}
            onOpen={props.handleClickOpen}
        >
            <NetworkSelectPopupContent {...props}/>
        </SwipeableDrawer>
    )
}

export default function NetworkSelect({type = "medium"}: { type?: "medium" | "small" | "large" | undefined }) {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const {
        appState: {
            chainInfo,
            currentPrice
        }
    } = useAppState();
    const [chainConfigs, setSupportedChainConfigs] = useState([]);
    const {isMobile} = useWindowSize();
    const {openDialog, closeDialog} = useDialog();

    useEffect(() => {
        Common.getAllChainsInfo().then(resp => {
            const chainsData = resp?.data?.chains;
            setSupportedChainConfigs(chainsData);
        });
    }, [])

    const handleClickOpen = () => {
        if (isMobile)
            setOpen(true);
        else
            openDialog(<NetworkDialogContent onNetworkSwitch={onNetworkSwitch}
                                             chainConfigs={chainConfigs}
                                             getLastViewedNetworks={getLastViewedNetworks}/>);
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
        if (isMobile)
            setOpen(false);
        else
            closeDialog();
    };

    const onNetworkSwitch = (networkName) => {
        if (networkName) {
            setOpen(false);
            //@ts-ignore
            let lastViewedNetworks = JSON.parse(window.localStorage.getItem("goat-last-viewed-networks"));
            if (!lastViewedNetworks)
                lastViewedNetworks = [];
            if (!lastViewedNetworks.includes(networkName))
                lastViewedNetworks.push(networkName);
            //@ts-ignore
            window.localStorage.setItem("goat-last-viewed-networks", JSON.stringify(lastViewedNetworks));
            //@ts-ignore
            window.location.href = window.location.origin + "/" + networkName;
        }
    };

    const getLastViewedNetworks = () => {
        //@ts-ignore
        const networks = JSON.parse(window.localStorage.getItem("goat-last-viewed-networks"));
        if (networks) {
            //@ts-ignore
            return chainConfigs.filter(c => networks?.includes(c?.name));
        }
        return [];
    }

    return (
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
            <NetworkDrawer key={"network-switch-drawer"}
                           open={open}
                           handleClose={handleClose}
                           handleClickOpen={handleClickOpen}
                           onNetworkSwitch={onNetworkSwitch}
                           chainConfigs={chainConfigs}
                           getLastViewedNetworks={getLastViewedNetworks}
            />
        </Button>
    );
}