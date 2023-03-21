import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {useTranslation} from "react-i18next";
import {Avatar, Badge, Chip, Stack, Typography} from "@mui/material";
import {useAppState} from "../../../hooks/useAppState";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useEffect, useState} from "react";
import Common from "../../../services/axios/common";
import {networkName} from "../../../constants/networkConfig";

export default function NetworkSelect({type = "medium"}: { type?: "medium" | "small" | "large" | undefined }) {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [network, setNetwork] = React.useState(networkName);
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
        });
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        setNetwork(event.target.value);
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
            window.location.href = window.location.origin + "/" + network;
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
                    <Box component="form" sx={{display: 'flex', flexWrap: 'wrap'}}>
                        <FormControl sx={{m: 1, minWidth: 120}} fullWidth>
                            <InputLabel htmlFor="network-dialog">Network</InputLabel>
                            <Select
                                value={network}
                                fullWidth={true}
                                onChange={handleChange}
                                input={<OutlinedInput label="Network" id="network-dialog"/>}
                            >
                                {chainConfigs.map(option =>
                                    <MenuItem
                                        //@ts-ignore
                                        key={option?.name}
                                        //@ts-ignore
                                        value={option?.name} sx={{justifyContent: "space-between"}}>
                                        <Stack direction="row" spacing={2}>
                                            <Badge
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                variant={"dot"}
                                                color={//@ts-ignore
                                                    option?.status === "live" ? "success" : "error"}
                                            >
                                                <Avatar
                                                    sx={{width: 30, height: 30, ml: 1}}
                                                    //@ts-ignore
                                                    src={option?.image}
                                                />
                                            </Badge>
                                            <Typography variant={"subtitle1"}>
                                                {//@ts-ignore
                                                    option?.pretty_name}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t("cancel")}</Button>
                    <Button onClick={handleSwitch}>{t("switch")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}