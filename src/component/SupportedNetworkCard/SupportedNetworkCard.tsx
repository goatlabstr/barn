import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Card, CardActionArea, CardActions, CardContent, CardHeader, Stack, Tooltip as MTooltip} from "@mui/material";
import Phone from '@mui/icons-material/PhoneIphone';
import {useTranslation} from "react-i18next";

export default function SupportedNetworkCard(props) {
    const {t} = useTranslation();
    const {
        data: {
            pretty_name,
            image,
            params: {
                calculated_apr
            }
        },
        rawData: {
            url,
            mobileSupport
        }
    } = props;

    const getCalculatedApr = (apr) => {
        return (apr * 100).toFixed(2);
    }

    return (
        <Card sx={{background: "linear-gradient(135deg, rgba(136,14,79,1) 15%, rgba(26,35,126,1) 100%)"}}>
            <CardActionArea onClick={() => {
                //@ts-ignore
                window.open(url, '_blank').focus()
            }}>
                <CardHeader
                    avatar={<Avatar src={image}/>}
                    title={pretty_name}
                    subheader={url}
                />
                <CardContent>
                    <Stack direction={"column"} sx={{ml: 7}}>
                        <Stack direction={"row"} sx={{alignItems: "center"}}
                               justifyContent={"space-between"}>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                variant="body1"
                                color="text.secondary"
                            >
                                {"APR: "}
                            </Typography>
                            <Typography
                                sx={{display: 'inline'}}
                                component="span"
                                color="secondary">
                                {getCalculatedApr(calculated_apr)}%
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions sx={{justifyContent: "end"}} >
                    {mobileSupport && <MTooltip title={t("supportedNetwork.keplrMobileSupport")}><Phone sx={{height: 23}}/></MTooltip>}
                    <MTooltip title={t("supportedNetwork.keplrSupport")}><img src={"/keplr-logo.png"} style={{height: 18}}/></MTooltip>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
