import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {Box, Button, FormControlLabel, Stack, Switch, Typography} from "@mui/material";
import {useAppSelector} from "../../../hooks/hook";
import {useAppState} from "../../../hooks/useAppState";
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";

interface TableProps {
    rows: Array<any>;
    title?: String;
    buttonTitle?: String;
    onClickToolbarButton?: Function;
    viewStakedValidators?: boolean;
}

const MobileToolbar = (props) => {
    const {t} = useTranslation();
    const {
        buttonTitle,
        title,
        onClickToolbarButton,
        viewStakedValidators,
        viewOnlyStakedVal,
        handleViewOnlyStakedVal
    } = props;

    return (
        <Grid container justifyContent={"space-between"} sx={{mb: 0.5}}>
            <Grid item>
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    {//@ts-ignore
                        buttonTitle && <Button variant="outlined"
                                               color="secondary"
                                               onClick={onClickToolbarButton}>{buttonTitle}</Button>}
                    {viewStakedValidators &&
                        <FormControlLabel sx={{mr: 1}}
                                          control={<Switch
                                              color="secondary"
                                              size="small"
                                              checked={viewOnlyStakedVal}
                                              onChange={handleViewOnlyStakedVal}
                                          />}
                                          label={t("viewStakedValidators")}/>
                    }
                </Stack>
            </Grid>
        </Grid>
    );
};

function MobileTable(props: TableProps) {
    const {rows, title, buttonTitle, onClickToolbarButton, viewStakedValidators} = props;
    const [viewOnlyStakedVal, setViewOnlyStakedVal] = useState(false);
    const [data, setData] = useState<Array<any>>([]);
    const {
        appState: {
            currentPrice,
            chainInfo
        }
    } = useAppState();

    const delegations = useAppSelector(state => state.accounts.delegations.result);

    useEffect(() => {
        rows.sort((a, b) => a?.rank - b?.rank)
        if (viewOnlyStakedVal) {
            setData(rows.filter(row => getStakeAmount(row) > 0))
        } else {
            setData(rows);
        }
    }, [rows, viewOnlyStakedVal]);

    const handleViewOnlyStakedVal = (event: React.ChangeEvent<HTMLInputElement>) => {
        setViewOnlyStakedVal(event.target.checked);
    };

    const getStakeAmount = (row) => {
        //@ts-ignore
        const decimals = chainInfo?.decimals | 6;
        let value = delegations.find((val) =>
            (val.delegation && val.delegation.validator_address) === row.operator_address);
        return value ? value.balance && value.balance.amount && value.balance.amount / 10 ** decimals : 0;
    }

    const getPrice = (row) => {
        if (currentPrice === undefined || currentPrice === null || currentPrice < 0)
            return 0;
        const stakedAmount = getStakeAmount(row);
        return (stakedAmount * currentPrice).toFixed(2)
    }

    return (
        <Box>
            {title &&
                <MobileToolbar title={title}
                               viewStakedValidators={viewStakedValidators}
                               viewOnlyStakedVal={viewOnlyStakedVal}
                               handleViewOnlyStakedVal={handleViewOnlyStakedVal}
                               buttonTitle={buttonTitle}
                               onClickToolbarButton={onClickToolbarButton}/>}
            <List sx={{width: '100%'}}>
                {
                    data && data.length > 0 ? data.map((row) => {
                        return (
                            <ListItem
                                sx={{
                                    borderStyle: "solid",
                                    borderWidth: "1px",
                                    borderColor: "rgb(131 157 170)",
                                    borderRadius: 1,
                                    mb: 1
                                }}
                                key={row?.rank}>
                                <Typography sx={{pr: 1}}>#{row?.rank}</Typography>
                                <ListItemAvatar>
                                    {   //@ts-ignore
                                        <Avatar src={row?.keybase_image}/>
                                    }
                                </ListItemAvatar>
                                <ListItemText primary={row?.description?.moniker}
                                              secondary={parseFloat((Number(row?.commission?.commission_rates?.rate) * 100).toFixed(2)) + "%"}/>
                                <Stack direction="column">
                                    <Typography color={"secondary"}>{getStakeAmount(row)}</Typography>
                                    <Typography variant={"body2"}>{"$" + getPrice(row)}</Typography>
                                </Stack>
                            </ListItem>
                        );
                    }) : (
                        <ListItem
                            sx={{
                                borderStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "rgb(131 157 170)",
                                borderRadius: 1,
                                mb: 1
                            }}>
                            <ListItemText primary={"No Data"} sx={{textAlign: "center"}}/>
                        </ListItem>
                    )
                }
            </List>
        </Box>
    );
}

export default MobileTable;
