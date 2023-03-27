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

    const getUnbondingTime = (time) => {
        let result = 0;
        if (time !== undefined)
            result = time / (24 * 60 * 60);
        return Math.round(result);
    }

    const CardItem = ({label, value}) => {

        return (<Stack direction={"row"} sx={{alignItems: "center"}}
                       justifyContent={"space-between"}>
            <Typography
                sx={{display: 'inline', fontWeight: 500}}
                component="span"
                variant="body1"
                color="text.secondary"
            >
                {label}
            </Typography>
            <Typography
                sx={{display: 'inline'}}
                component="span"
                color="secondary">
                {value}
            </Typography>
        </Stack>)
    }

    return (
        <Card sx={{background: "linear-gradient(135deg, rgba(136,14,79,1) 25%, rgba(26,35,126,1) 100%)"}}>
            <CardActionArea>
                <div onClick={() => {
                    //@ts-ignore
                    window.location.href = window.location.origin + "/" + data?.name;
                }}>
                    <CardHeader
                        avatar={<Avatar src={data?.image}
                                        sx={{
                                            width: 55,
                                            height: 55,
                                            filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5))"
                                        }}/>}
                        title={data?.pretty_name}
                        subheader={window.location.origin + "/" + data?.name}
                    />
                    <CardContent>
                        <Stack direction={"column"} sx={{ml: 7}}>
                            <CardItem label={"Base Inflation :"}
                                      value={getCalculatedApr(data?.params?.base_inflation) + "%"}/>
                            <CardItem label={"APR :"} value={getCalculatedApr(data?.params?.calculated_apr) + "%"}/>
                            <CardItem label={"Unbonding Time :"}
                                      value={getUnbondingTime(data?.params?.unbonding_time) + " day"}/>
                            <CardItem label={"Max Validators :"} value={data?.params?.max_validators}/>
                        </Stack>
                    </CardContent>
                </div>
                <CardActions sx={{justifyContent: "space-between"}}>
                    <Typography
                        sx={{display: 'inline'}}
                        variant={"body1"} color={data?.status === "live" ? "#ceef8e" : "red"}>
                        {data?.status}
                    </Typography>
                    <Stack direction={"row"} spacing={1}>
                        {data?.website && <MTooltip title={t("supportedNetwork.website")}><img
                            onClick={() => window.open(data?.website, "_blank")}
                            src={"/www-logo.svg"}
                            style={{height: 23}}/></MTooltip>}
                        <MTooltip title={t("supportedNetwork.keplrSupport")}><img src={"/keplr-logo.png"}
                                                                                  style={{height: 23}}/></MTooltip>
                    </Stack>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}
