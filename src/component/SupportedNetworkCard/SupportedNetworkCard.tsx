import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Card, CardActionArea, CardActions, CardContent, CardHeader, Stack, Tooltip as MTooltip} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function SupportedNetworkCard(props) {
    const {t} = useTranslation();
    const {
        data
    } = props;

    const getCalculatedApr = (apr) => {
        if (apr !== undefined)
            return (apr * 100).toFixed(2);
        return 0;
    }

    return (
        <Card sx={{background: "linear-gradient(135deg, rgba(136,14,79,1) 15%, rgba(26,35,126,1) 100%)"}}>
            <CardActionArea onClick={() => {
                //@ts-ignore
                window.location.href = window.location.origin + "/" + data?.name;
            }}>
                <CardHeader
                    avatar={<Avatar src={data?.image}/>}
                    title={data?.pretty_name}
                    subheader={window.location.origin + "/" + data?.name}
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
                                {getCalculatedApr(data?.params?.calculated_apr)}%
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions sx={{justifyContent: "end"}}>
                    <MTooltip title={t("supportedNetwork.keplrSupport")}><img src={"/keplr-logo.png"}
                                                                              style={{height: 23}}/></MTooltip>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
