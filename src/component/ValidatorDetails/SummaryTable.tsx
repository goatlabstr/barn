import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {visuallyHidden} from '@mui/utils';
import {Avatar, Button, ButtonGroup, Stack, Typography} from "@mui/material";
import {formatCount, getComparator, Order, stableSort} from './CommonTable';
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {useAppSelector} from "../../customHooks/hook";
import {useTranslation} from "react-i18next";
import {useDialog} from "../../context/DialogContext/DialogContext";
import DelegateDialog from "./Delegation/DelegateDialog";
import RedelegateDialog from "./Delegation/RedelegateDialog";
import UndelegateDialog from "./Delegation/UndelegateDialog";
import {getConfig} from "../../services/network-config";

const useStyles = makeStyles((theme: Theme) => ({
    tableHead: {
        //@ts-ignore
        backgroundColor: theme.palette.background.dark,
        borderTopColor: "rgb(131 157 170)",
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
    emptyCell: {
        color: "rgb(131 157 170)"
    }
}));

interface TableProps {
    rows: Array<any>;
    images: Array<any>;
    title?: String;
}

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'validator',
        numeric: false,
        disablePadding: false,
        label: 'Validator',
    },
    {
        id: 'stakeAmount',
        numeric: true,
        disablePadding: false,
        label: 'Staked Amount',
    },
    {
        id: 'pendingRewards',
        numeric: true,
        disablePadding: false,
        label: 'PendingRewards',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
    },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const classes = useStyles();
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

const DelegationButtonGroup = ({stakeAmount, rowData}) => {
    const {openDialog, closeDialog} = useDialog();
    const {t} = useTranslation();

    if (typeof stakeAmount !== "number" || stakeAmount <= 0)
        return <><ButtonGroup variant="text" size="small"><Button color="success" onClick={() => openDialog(
            <DelegateDialog initialValidator={rowData}/>, t("delegateTitle"))}>Delegate</Button></ButtonGroup></>
    else
        return <><ButtonGroup variant="text" size="small">
            <Button color="warning" onClick={() => openDialog(
                <RedelegateDialog initialValidator={rowData}/>, t("redelegateTitle"))}>Redelegate</Button>
            <Button color="success" onClick={() => openDialog(
                <DelegateDialog initialValidator={rowData}/>, t("delegateTitle"))}>Delegate</Button>
            <Button color="error" onClick={() => openDialog(
                <UndelegateDialog initialValidator={rowData}/>, t("undelegateTitle"))}>Undelegate</Button>
        </ButtonGroup></>
}

export default function SummaryTable(props: TableProps) {
    const {rows, images} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('validator');
    const {t} = useTranslation();

    const rewards = useAppSelector(state => state.accounts.rewards.result);
    const delegations = useAppSelector(state => state.accounts.delegations.result);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: any,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const getImage = (id) => {
        const image = images.filter((value) => value._id === id.toString());
        //@ts-ignore
        return <Avatar src={image[0]?.them[0]?.pictures?.primary?.url}></Avatar>
    }

    const getStakeAmount = (row) => {
        let value = delegations.find((val) =>
            (val.delegation && val.delegation.validator_address) === row.operator_address);
        return value ? value.balance && value.balance.amount && value.balance.amount / 10 ** getConfig("COIN_DECIMALS") : 0;
    }

    const handleStakeAmount = (row) => {
        const val = getStakeAmount(row)
        if (val > 0)
            return formatCount(val);
        return <Typography variant={"body2"}>{t("table.noTokens")}</Typography>;
    }

    const handlePendingRewards = (row) => {
        let value = rewards && rewards.rewards?.find((val) =>
            (val.validator_address) === row.operator_address);
        value = value && value.reward ? value.reward[0].amount / 10 ** getConfig("COIN_DECIMALS") : 0;
        return formatCount(value);
    }

    return (
        <Box sx={{width: '100%'}}>
            <TableContainer>
                <Table
                    sx={{minWidth: 450}}
                    aria-labelledby="tableTitle"
                    size="small"
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        //@ts-ignore
                                        key={row?.description?.moniker}
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
                                        <TableCell align="center"
                                                   className={classes.tableActiveCell}>{handleStakeAmount(row)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{handlePendingRewards(row)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{<DelegationButtonGroup
                                            stakeAmount={getStakeAmount(row)}
                                            rowData={row}/>}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {rows.length <= 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center"
                                           className={classes.emptyCell}>No Data Found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
