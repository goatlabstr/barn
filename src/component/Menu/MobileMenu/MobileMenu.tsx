import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/MoreVert";
import allActions from "../../../action";
import {useKeplr} from "../../../hooks/use-keplr/hook";
import {useAppDispatch, useAppSelector} from "../../../hooks/hook";
import {useTranslation} from "react-i18next";
import {Email, Instagram, Telegram, Twitter, ContentCopy} from "@mui/icons-material";
import {CopyAddressButton} from "../SideBar/CopyAddressButton";
import {Stack} from "@mui/material";


export default function MobileMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {clearLastUsedKeplr} = useKeplr();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const address = useAppSelector(state => state.accounts.address.value);

    const handleDisconnectButtonClick = () => {
        clearLastUsedKeplr();
        localStorage.clear();
        dispatch(allActions.disconnectSet());
    }

    return (
        <React.Fragment>
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    aria-controls={open ? 'mobile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{
                        ml: 2,
                        display: {md: 'none'},
                        filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                    }}
                >
                    <MenuIcon fontSize={"large"}/>
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                {address && <Box>
                    <Stack direction="row" sx={{mt: 1, mr: 2, ml: 2}}>
                        <CopyAddressButton address={address} width={150}/>
                    </Stack>
                    <Divider/>
                </Box>}
                <MenuItem
                    //@ts-ignore
                    onClick={() => window.open("https://twitter.com/GOATValidator", '_blank').focus()}>
                    <ListItemIcon>
                        <Twitter fontSize="small"/>
                    </ListItemIcon>
                    Twitter
                </MenuItem>
                <MenuItem
                    //@ts-ignore
                    onClick={() => window.open("https://www.instagram.com/goatlabsv/", '_blank').focus()}>
                    <ListItemIcon>
                        <Instagram fontSize="small"/>
                    </ListItemIcon>
                    Instagram
                </MenuItem>
                <MenuItem
                    //@ts-ignore
                    onClick={() => window.open("https://t.me/goatlabs", '_blank').focus()}>
                    <ListItemIcon>
                        <Telegram fontSize="small"/>
                    </ListItemIcon>
                    Telegram
                </MenuItem>
                <MenuItem
                    //@ts-ignore
                    onClick={() => window.open("mailto:goatlabsteam@gmail.com")}>
                    <ListItemIcon>
                        <Email fontSize="small"/>
                    </ListItemIcon>
                    E-Mail
                </MenuItem>
                {(localStorage.getItem('goat_wl_addr') || address) &&
                    <Box>
                        <Divider/>
                        <MenuItem onClick={() => handleDisconnectButtonClick()}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            {t("menu.disconnect")}
                        </MenuItem>
                    </Box>}
            </Menu>
        </React.Fragment>
    );
}
