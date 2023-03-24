import * as React from 'react';
import {useEffect, useState} from 'react';
import Common from "../services/axios/common";
import {Grid, Box} from "@mui/material";
import SupportedNetworkCard from "../component/SupportedNetworkCard/SupportedNetworkCard";
import SearchTextField from "../component/ValidatorDetails/SearchTextField";

function Index() {
    const [supportedChainConfigs, setSupportedChainConfigs] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [filterValue, setFilterValue] = useState<string>("");

    useEffect(() => {
        Common.getAllChainsInfo().then(resp => {
            const chainsData = resp?.data?.chains;
            setSupportedChainConfigs(chainsData);
            setRawData(chainsData);
        })
    }, [])

    useEffect(() => {
        if (!filterValue || /^\s*$/.test(filterValue))
            setSupportedChainConfigs(rawData);
        else
            //@ts-ignore
            setSupportedChainConfigs(rawData.filter(x => x?.name?.toLowerCase().includes(filterValue.toLowerCase())))
    }, [filterValue]);

    return (
        <Box sx={{p: 5}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <SearchTextField value={filterValue} onChange={(e) => setFilterValue(e.target.value)}/>
                </Grid>
                {supportedChainConfigs.map(config => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}
                        //@ts-ignore
                          key={config?.name}>
                        <SupportedNetworkCard
                            data={config}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Index;
