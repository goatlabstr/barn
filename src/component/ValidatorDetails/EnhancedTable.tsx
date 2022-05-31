import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import {Avatar, Button, ButtonGroup, Chip, Stack, Toolbar, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import clsx from "clsx";
import {formatCount, getComparator, Order, stableSort} from './CommonTable';
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";
import {Done as ActiveIcon,
    HourglassEmpty as UnboundingIcon,
    Block as JailedIcon,
    AccessAlarms as InactiveIcon} from '@mui/icons-material';
import SearchTextField from "./SearchTextField";
import {useTranslation} from "react-i18next";
import {config} from "../../constants/networkConfig";
import {useAppSelector} from "../../customHooks/hook";

const useStyles = makeStyles((theme: Theme) => ({
    tableHead: {
        //@ts-ignore
        backgroundColor: theme.palette.background.dark
    },
    tableCell: {
        borderColor: "rgb(131 157 170)"
    },
    tableActiveCell: {
        borderColor: "rgb(131 157 170)",
        color: theme.palette.secondary.light
    },
    tablePassiveCell: {
        borderColor: "rgb(131 157 170)",
        color: "rgb(131 157 170)"
    },
    tableSortLabel: {
        color: "rgb(131 157 170)"
    },
    tableSearch: {
        marginRight: theme.spacing(2)
    },
    emptyCell: {
        color: "rgb(131 157 170)"
    }
}));

interface TableProps {
    rows: Array<any>;
    images: Array<any>;
    title?: String;
    buttonTitle?: String;
    onClickToolbarButton?: Function;
    search?: Boolean;
}

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

export interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    order: Order;
    orderBy: string;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'validator',
        numeric: false,
        disablePadding: false,
        label: 'Validator',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'votingPower',
        numeric: true,
        disablePadding: false,
        label: 'Voting Power',
    },
    {
        id: 'commission',
        numeric: true,
        disablePadding: false,
        label: 'Commission',
    },
    {
        id: 'stakeAmount',
        numeric: true,
        disablePadding: false,
        label: 'Staked Amount',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
    },
];

const EnhancedTableToolbar = (props) => {
    const {onChangeSearchValue, searchActive} = props;
    const classes = useStyles();
    const [value, setValue] = useState("");

    const handleValueChange = (event) => {
        if (onChangeSearchValue && typeof onChangeSearchValue === 'function')
            onChangeSearchValue(event.target.value);
        setValue(event.target.value);
    }

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1}
            }}
        >
            <Grid container justifyContent={"space-between"}>
                <Grid item>
                    <Typography
                        sx={{flex: '1 1 100%'}}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {props.title}
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                        {searchActive && <SearchTextField value={value} onChange={handleValueChange}
                                                          className={classes.tableSearch}/>}
                        {props.buttonTitle && <Button variant="outlined"
                                                      color="secondary"
                                                      onClick={props.onClickToolbarButton}>{props.buttonTitle}</Button>}
                    </Stack>
                </Grid>
            </Grid>
        </Toolbar>
    );
};

export function EnhancedTableHead(props: EnhancedTableProps) {
    const classes = useStyles();
    const {t} = useTranslation();
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler =
        (property: any) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    const getHeaderStyle = (index) => {
        if (index === 0)
            return {borderTopLeftRadius: "1rem"}
        else if (index === headCells.length - 1)
            return {borderTopRightRadius: "1rem"}
        return {}
    }

    return (
        <TableHead>
            <TableRow className={classes.tableHead}>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={headCell.id}
                        align={(headCell.numeric || index == headCells.length - 1) ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={getHeaderStyle(index)}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            className={classes.tableSortLabel}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const delegationButtonGroup = (stakeAmount) => {
    if (typeof stakeAmount !== "number" || stakeAmount <= 0)
        return <><ButtonGroup variant="text" size="small"><Button color="success">Delegate</Button></ButtonGroup></>
    else
        return <><ButtonGroup variant="text" size="small">
            <Button color="warning">Redelegate</Button>
            <Button color="success">Delegate</Button>
            <Button color="error">Undelegate</Button>
        </ButtonGroup></>
}

export default function EnhancedTable(props: TableProps) {
    const {images, rows, title, buttonTitle, onClickToolbarButton, search} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('validator');
    const [filterValue, setFilterValue] = useState<string>("");
    const [data, setData] = useState<any>([]);
    const {t} = useTranslation();

    const delegations = useAppSelector(state => state.accounts.delegations.result);

    const getImage = (id) => {
        const image = images.filter((value) => value._id === id?.toString());
        //@ts-ignore
        return <Avatar src={image[0]?.them[0]?.pictures?.primary?.url}></Avatar>
    }

    const handleStakeAmount = (row) => {
        let value = delegations.find((val) =>
            (val.delegation && val.delegation.validator_address) === row.operator_address);
        let val = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : 0;
        if (val > 0)
            return formatCount(val);
        return <Typography variant={"body2"}>{t("table.noTokens")}</Typography>;
    }

    useEffect(() => {
        if (!filterValue || /^\s*$/.test(filterValue))
            setData(rows);
        else
            //@ts-ignore
            setData(rows.filter(x => x?.description?.moniker?.toLowerCase().includes(filterValue.toLowerCase())))
    }, [filterValue]);

    useEffect(() => {
        setData(rows)
    }, [rows]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: any,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getStatus = (val) => {
        let label: string;
        let icon: JSX.Element;
        switch (val) {
            case 1:
                label = t("inactive");
                icon = <InactiveIcon />
                break;
            case 2:
                label = t("unbounding");
                icon = <UnboundingIcon />
                break;
            case 3:
                label = t("active");
                icon = <ActiveIcon />
                break;
            default:
                label = t("jailed");
                icon = <JailedIcon />
                break;
        }
        return <Chip label={label} variant="filled" icon={icon}/>;
    }


    return (
        <Box sx={{width: '100%'}}>
            {title && <EnhancedTableToolbar title={title} buttonTitle={buttonTitle}
                                            onClickToolbarButton={onClickToolbarButton}
                                            onChangeSearchValue={setFilterValue}
                                            searchActive={search}
            />}
            <TableContainer>
                <Table
                    sx={{minWidth: 650}}
                    aria-labelledby="tableTitle"
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(data, getComparator(order, orderBy))
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        //@ts-ignore
                                        key={row.description.moniker}
                                    >
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                            className={classes.tableCell}
                                        >
                                            <Stack direction="row" spacing={1}>
                                                {   //@ts-ignore
                                                    getImage(row?.description?.identity)
                                                }
                                                <Typography style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    display: "flex"
                                                }}          //@ts-ignore
                                                            variant={"body2"}>{row?.description?.moniker}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell
                                            className={classes.tableCell}>
                                            {getStatus(row.status)}
                                        </TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>
                                            {
                                                formatCount(parseFloat((Number(row.tokens) / (10 ** config.COIN_DECIMALS)).toFixed(1)))
                                            }
                                        </TableCell>
                                        <TableCell align="center"
                                            //@ts-ignore
                                                   className={classes.tableCell}>
                                            {
                                                //@ts-ignore
                                                parseFloat((Number(row?.commission?.commission_rates?.rate) * 100).toFixed(2))
                                            }%
                                        </TableCell>
                                        <TableCell align="center" className={clsx(classes.tableCell, {
                                            [classes.tableActiveCell]: row.stakeAmount > 0,
                                            [classes.tablePassiveCell]: row.stakeAmount <= 0
                                        })}>{handleStakeAmount(row)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{delegationButtonGroup(handleStakeAmount(row))}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {data.length <= 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center"
                                           className={classes.emptyCell}>No Data Found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
