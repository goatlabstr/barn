
const COUNT_ABBRS = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    let aVal;
    let bVal;
    switch (orderBy){
        case "validator":
            aVal = a["description"]?.moniker;
            bVal = b["description"]?.moniker;
            break;
        case "status":
            aVal = a["status"];
            bVal = b["status"];
            break;
        case "votingPower":
            aVal = parseInt(a["tokens"]);
            bVal = parseInt(b["tokens"]);
            break;
        case "commission":
            aVal = a["commission"]?.commission_rates?.rate;
            bVal = b["commission"]?.commission_rates?.rate;
            break;
        default:
            aVal = a[orderBy];
            bVal = b[orderBy];

    }
    if (bVal < aVal) {
        return -1;
    }
    if (bVal > aVal) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const formatCount = (value, decimals = 4) => {
    let i = (value === 0) ? value : Math.floor(Math.log(value) / Math.log(1000));
    if (i < 0)
        i = 0;
    let result = parseFloat((value / Math.pow(1000, i)).toFixed(decimals));
    return result + COUNT_ABBRS[i];
};