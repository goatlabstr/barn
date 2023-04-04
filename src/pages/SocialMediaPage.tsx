import * as React from 'react';
import {Box, Divider, Grid, IconButton, List, ListItem, Stack} from "@mui/material";
import {AccountBalanceWalletRounded, Email, Instagram, LogoutRounded, Telegram, Twitter} from "@mui/icons-material";
import logo from "../logo.svg";

function SocialMediaPage() {

    return (
        <>
            <Box sx={{
                backgroundRepeat: "repeat-x",
                backgroundPosition: "left center",
                position: "fixed",
                zIndex: -1,
                backgroundImage: "url(/banner-move.png)",
                width: "100%",
                height: "100%",
                opacity: 0.3
            }}/>
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center" sx={{mt: 15}} spacing={5}>
                <Grid item xs={12}>
                    <Stack alignItems="center"
                           spacing={2}>
                        <img style={{
                            width: 150,
                            filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                        }} src={logo}/>
                        <Box
                            component="a"
                            sx={{
                                pl: 3,
                                display: 'flex',
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 600,
                                fontSize: 19,
                                letterSpacing: '1.5rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            GOAT
                        </Box>
                    </Stack>
                    <Divider sx={{pt: 1, mb: 1}}/>
                    <Box
                        component="a"
                        sx={{
                            pl: 3,
                            display: 'flex',
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: 19,
                            letterSpacing: '1.5rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        VALIDATOR
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" sx={{justifyContent: "center"}} spacing={4}>
                        <IconButton sx={{color: "#1DA1F2"}} size={"large"}
                            //@ts-ignore
                                    onClick={() => window.open("https://twitter.com/GoatlabsV", '_blank').focus()}
                        ><Twitter fontSize="inherit"/></IconButton>
                        <IconButton sx={{color: "rgb(131 157 170)"}} size={"large"}
                            //@ts-ignore
                                    onClick={() => window.open("https://www.instagram.com/goatlabsv/", '_blank').focus()}
                        ><Instagram fontSize="inherit"/></IconButton>
                        <IconButton sx={{color: "#D1B000"}} size={"large"}
                            //@ts-ignore
                                    onClick={() => window.open("mailto:goatlabsteam@gmail.com")}
                        ><Email fontSize="inherit"/></IconButton>
                        <IconButton sx={{color: "#2AABEE"}} size={"large"}
                            //@ts-ignore
                                    onClick={() => window.open("https://t.me/goatlabs", '_blank').focus()}
                        ><Telegram fontSize="inherit"/></IconButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

export default SocialMediaPage;
