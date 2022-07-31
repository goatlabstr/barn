import React, {FunctionComponent} from "react";
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import {Box, ListItemButton} from "@mui/material";
import {useGlobalPreloader} from "../../hooks/useGlobalPreloader";

export const KeplrConnectionSelectDialog: FunctionComponent<{
    isOpen: boolean;
    onRequestClose: () => void;
    overrideWithKeplrInstallLink?: string;
    onSelectExtension: () => void;
    onSelectWalletConnect: () => void;
}> = ({
          isOpen,
          onRequestClose,
          overrideWithKeplrInstallLink,
          onSelectExtension,
          onSelectWalletConnect,
      }) => {
    const {passivate} = useGlobalPreloader();

    const handleClose = () => {
        onRequestClose();
        passivate();
    };

    return (
        <Dialog onClose={handleClose} open={isOpen} fullWidth maxWidth={"xs"}>
            <DialogTitle>Connect Wallet</DialogTitle>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 1
            }}>
                <List>
                    {overrideWithKeplrInstallLink ?
                        (<ListItemButton
                            sx={{
                                bgcolor: 'background.paper',
                                p: 2,
                                mb: 1,
                                mr: 2,
                                ml: 2,
                                textAlign: "center",
                                borderRadius: 3
                            }}
                            onClick={() => {
                                window.open(overrideWithKeplrInstallLink, "_blank");
                            }} key={"keplr-extension"}>
                            <ListItemAvatar>
                                <Avatar src={"/keplr-logo.png"} sx={{ width: 50, height: 50 }}>
                                    <PersonIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Install Keplr"} secondary={overrideWithKeplrInstallLink}/>
                        </ListItemButton>) :
                        (<ListItemButton
                            sx={{
                                bgcolor: 'background.paper',
                                p: 2,
                                mb: 1,
                                mr: 2,
                                ml: 2,
                                textAlign: "center",
                                borderRadius: 3
                            }}
                            onClick={() => {
                                onSelectExtension();
                            }} key={"keplr-extension"}>
                            <ListItemAvatar>
                                <Avatar src={"/keplr-logo.png"} sx={{ width: 50, height: 50 }}>
                                    <PersonIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Keplr Wallet"} secondary="Keplr Browser Extension"/>
                        </ListItemButton>)
                    }
                    <ListItemButton
                        sx={{
                            bgcolor: 'background.paper',
                            p: 2,
                            mb: 1,
                            mr: 2,
                            ml: 2,
                            textAlign: "center",
                            borderRadius: 3
                        }}
                        onClick={() => {
                            onSelectWalletConnect();
                        }} key={"keplr-wallet-connect"}>
                        <ListItemAvatar>
                            <Avatar src={"/wallet-connect-logo.png"} sx={{ width: 50, height: 50 }}>
                                <PersonIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={"WalletConnect"} secondary="Keplr Mobile"/>
                    </ListItemButton>
                </List>
            </Box>
        </Dialog>
    )
};
