import * as React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import SummaryTable from "./SummaryTable";
import {useTranslation} from "react-i18next";
import {config} from "../../constants/networkConfig";

function Index(props) {
    const {rows, images} = props;
    const {t} = useTranslation();

    return (
        <React.Fragment>
            <Grid container rowSpacing={0.5}>
                <>
                    <Grid item xs={10}>
                        <Typography variant={"h6"}>{t("staking.name",{"name": config.NETWORK_NAME})}</Typography>
                        <Typography variant={"body1"} style={{color: "rgb(131 157 170)"}}>{t("staking.totalStaked", {
                            "value": "200.013K"
                        })}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" color="secondary" size="small">{t("claimReward", {
                            "value": 97.9,
                            "name": config.NETWORK_NAME
                        })}</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <SummaryTable rows={rows} images={images}/>
                    </Grid>
                </>
            </Grid>
        </React.Fragment>
    );
}

export default Index;
