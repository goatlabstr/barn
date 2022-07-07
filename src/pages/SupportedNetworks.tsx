import * as React from 'react';
import {useEffect, useState} from 'react';
import Common from "../services/axios/common";
import {Grid, Box} from "@mui/material";
import SupportedNetworkCard from "../component/SupportedNetworkCard/SupportedNetworkCard";

function Index() {
    const [supportedChainConfigs, setSupportedChainConfigs] = useState([]);
    const [supportedNetworkUrls, setSupportedNetworkUrls] = useState({});

    useEffect(() => {
        Common.getSupportedNetworks().then(res => {
            const data = res.data;
            setSupportedNetworkUrls(data);
            Common.getAllChainsInfo().then(resp => {
                const chainsData = resp.data?.chains;
                setSupportedChainConfigs(chainsData.filter(conf => Object.keys(data).includes(conf.name)));
            })
        })
    }, [])

    return (
        <Box sx={{p: 5}}>
            <Grid container spacing={1}>
                {supportedChainConfigs.map(config => (
                    <Grid item xs={12} md={4} lg={3}
                        //@ts-ignore
                          key={config?.name}>
                        <SupportedNetworkCard
                            data={config}
                            //@ts-ignore
                            url={supportedNetworkUrls[config?.name]}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Index;
