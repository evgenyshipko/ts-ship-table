import { ColumnValueType, TableProps } from '..';
import moment from 'moment';
import C, { COLUMN_TYPE } from '../constants/C';
import { RowType } from 'react-bs-table';
import { ShipTableState } from '../components/ShipTable';
import { getColumnValueType } from './common';

const defaultSort = (asc: boolean, a: any, b: any) => {
    if (asc) {
        return a > b ? 1 : -1;
    } else {
        return a < b ? 1 : -1;
    }
};

const sortTextValueType = (asc: boolean, a: string, b: string) => {
    const collator = new Intl.Collator(['en-US', 'ru-RU'], {
        sensitivity: 'accent',
    });
    const comparingResult = collator.compare(a, b);
    return asc ? comparingResult : comparingResult * -1;
};

const sortDateValueType = (asc: boolean, a: string, b: string) => {
    const aMoment = moment(a, C.DATE_FORMAT);
    const bMoment = moment(b, C.DATE_FORMAT);
    return defaultSort(asc, aMoment, bMoment);
};

const sortByValueType = (
    columnValueType: ColumnValueType,
    asc: boolean,
    a: string,
    b: string
) => {
    switch (columnValueType) {
        case COLUMN_TYPE.TEXT:
            return sortTextValueType(asc, a, b);
        case COLUMN_TYPE.DATE:
            return sortDateValueType(asc, a, b);
        default:
            return defaultSort(asc, a, b);
    }
};

export const sortTableRows = (
    props: TableProps,
    state: ShipTableState,
    tableRows: Array<RowType>
) => {
    const sortColumnId = state.sortInfo.columnId;
    const asc = state.sortInfo.asc === undefined ? true : state.sortInfo.asc;
    const columnValueType = getColumnValueType(props, sortColumnId);
    if (sortColumnId) {
        tableRows = tableRows.sort((a, b) => {
            const aValue = a.data[sortColumnId]?.value;
            const bValue = b.data[sortColumnId]?.value;
            if (a.id === C.FILTER_ROW_ID) {
                return -1;
            } else if (b.id === C.FILTER_ROW_ID) {
                return 1;
            }
            if (aValue !== undefined && bValue !== undefined) {
                return sortByValueType(columnValueType, asc, aValue, bValue);
            } else if (aValue !== undefined && bValue === undefined) {
                return -1;
            } else if (aValue === undefined && bValue !== undefined) {
                return 1;
            }
            return 0;
        });
    }
    return tableRows;
};
