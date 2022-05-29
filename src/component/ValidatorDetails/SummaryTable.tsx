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
import {Button, ButtonGroup, Stack, Typography} from "@mui/material";
import {formatCount, getComparator, Order, stableSort} from './CommonTable';
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

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


interface Data {
    avatar: any;
    validator: string;
    stakeAmount: number;
    pendingRewards: number;
    action: any;
}

interface TableProps {
    rows: Array<Data>;
    title?: String;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
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
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const classes = useStyles();
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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
    if (stakeAmount <= 0)
        return <><ButtonGroup variant="text" size="small"><Button color="success">Delegate</Button></ButtonGroup></>
    else
        return <><ButtonGroup variant="text" size="small">
            <Button color="warning">Redelegate</Button>
            <Button color="success">Delegate</Button>
            <Button color="error">Undelegate</Button>
        </ButtonGroup></>
}

export default function SummaryTable(props: TableProps) {
    const {rows} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('validator');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


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
                                        key={row.validator}
                                    >
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="normal"
                                            className={classes.tableCell}
                                        >
                                            <Stack direction="row" spacing={1}>
                                                {row.avatar}
                                                <Typography style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    display: "flex"
                                                }}
                                                            variant={"body2"}>{row.validator}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableActiveCell}>{formatCount(row.stakeAmount)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{formatCount(row.pendingRewards)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{delegationButtonGroup(row.stakeAmount)}</TableCell>
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
