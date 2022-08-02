import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Card, CardActionArea, CardContent, CardHeader, Stack} from "@mui/material";

export default function SupportedNetworkCard(props) {
    const {
        data: {
            pretty_name,
            image,
            params: {
                calculated_apr
            }
        },
        url
    } = props;

    const getCalculatedApr = (apr) => {
        return (apr * 100).toFixed(2);
    }

    return (
        <Card>
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
                        <Stack direction={"row"} spacing={2} sx={{alignItems: "center"}}
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
            </CardActionArea>
        </Card>
    );
}
