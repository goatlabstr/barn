import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from "react-i18next";
import {Avatar, Stack, Typography} from "@mui/material";
import {useAppState} from "../../../hooks/useAppState";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Common from "../../../services/axios/common";
import {networkName} from "../../../constants/networkConfig";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {darken, lighten, styled} from '@mui/system';

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

    const handleChange = (network: object | null) => {
        setNetwork(network);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    const handleSwitch = (event: React.SyntheticEvent<unknown>, reason?: string) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
            //@ts-ignore
            window.location.href = window.location.origin + "/" + network?.name;
        }
    };

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
            </Button>
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
                    <Button onClick={handleSwitch}>{t("switch")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}