import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import {Button, ButtonGroup, Stack, Toolbar, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import clsx from "clsx";
import {formatCount, getComparator, Order, stableSort} from './CommonTable';
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";

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
    }
}));


interface Data {
    avatar: any;
    validator: string;
    status: any;
    votingPower: number;
    commission: number;
    stakeAmount: number;
    action: any;
}

interface TableProps {
    rows: Array<Data>;
    title?: String;
    buttonTitle?: String;
    onClickToolbarButton?: Function;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
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
    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1}
            }}
        >
            <Grid container>
                <Grid item xs={11}>
                    <Typography
                        sx={{flex: '1 1 100%'}}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {props.title}
                    </Typography>
                </Grid>
                {props.buttonTitle && <Grid item xs={1}>
                    <Button variant="outlined"
                            color="secondary"
                            onClick={props.onClickToolbarButton}>{props.buttonTitle}</Button>
                </Grid>}
            </Grid>
        </Toolbar>
    );
};

export function EnhancedTableHead(props: EnhancedTableProps) {
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

export default function EnhancedTable(props: TableProps) {
    const {rows, title, buttonTitle, onClickToolbarButton} = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('validator');

    const handleStakeAmount = (value) => {
        if (value > 0)
            return formatCount(value);
        return <Typography variant={"body2"}>no tokens</Typography>;
    }

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
            {title && <EnhancedTableToolbar title={title} buttonTitle={buttonTitle}
                                            onClickToolbarButton={onClickToolbarButton}/>}
            <TableContainer>
                <Table
                    sx={{minWidth: 450}}
                    aria-labelledby="tableTitle"
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
                                        <TableCell className={classes.tableCell}>{row.status}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{formatCount(row.votingPower)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{row.commission}%</TableCell>
                                        <TableCell align="center" className={clsx(classes.tableCell, {
                                            [classes.tableActiveCell]: row.stakeAmount > 0,
                                            [classes.tablePassiveCell]: row.stakeAmount <= 0
                                        })}>{handleStakeAmount(row.stakeAmount)}</TableCell>
                                        <TableCell align="center"
                                                   className={classes.tableCell}>{delegationButtonGroup(row.stakeAmount)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {rows.length <= 0 && (
                            <TableRow>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
