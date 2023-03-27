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
import {useAppSelector} from "../../hooks/hook";
import {useTranslation} from "react-i18next";
import {useDialog} from "../../hooks/use-dialog/DialogContext";
import DelegateDialog from "./Delegation/DelegateDialog";
import RedelegateDialog from "./Delegation/RedelegateDialog";
import UndelegateDialog from "./Delegation/UndelegateDialog";
import {useAppState} from "../../hooks/useAppState";

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
        // color: "rgb(131 157 170)"
    }
}));

interface TableProps {
    rows: Array<any>;
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
    }
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const classes = useStyles();
    const {order, orderBy, onRequestSort} = props;
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

export default function SummaryTable(props: TableProps) {
    const {rows} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<any>('validator');
    const {t} = useTranslation();
    const {
        appState: {
            chainInfo
        }
    } = useAppState();

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

    const getStakeAmount = (row) => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        let value = delegations.find((val) =>
            (val.delegation && val.delegation.validator_address) === row.operator_address);
        return value ? value.balance && value.balance.amount && value.balance.amount / 10 ** decimals : 0;
    }

    const handleStakeAmount = (row) => {
        const val = getStakeAmount(row)
        if (val > 0)
            return formatCount(val);
        return <Typography variant={"body2"}>{t("table.noTokens")}</Typography>;
    }

    const handlePendingRewards = (row) => {
        //@ts-ignore
        const decimals = chainInfo?.decimals || 6;
        let value = rewards && rewards.rewards?.find((val) =>
            (val.validator_address) === row.operator_address);
        value = value && value.reward ? value.reward[0].amount / 10 ** decimals : 0;
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
                                                {
                                                    //@ts-ignore
                                                    <Avatar src={row?.keybase_image}/>
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
