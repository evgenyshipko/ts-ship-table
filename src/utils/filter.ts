import { ColumnValueType, TableProps } from '..';
import { RowType } from 'react-bs-table';
import C, { COLUMN_TYPE } from '../constants/C';
import moment from 'moment';
import { ShipTableState } from '../components/ShipTable';

const getColumnValueType = (
    props: TableProps,
    columnId: string | undefined
) => {
    return props.columns.find((columnData) => {
        return columnData.field === columnId;
    })?.columnValueType;
};

const isNumberValuePassedFilter = (
    value: number,
    filterValue: { minValue?: number; maxValue?: number }
) => {
    if (filterValue.minValue && filterValue.maxValue) {
        return value >= filterValue.minValue && value <= filterValue.maxValue;
    } else if (filterValue.minValue) {
        return value >= filterValue.minValue;
    } else if (filterValue.maxValue) {
        return value <= filterValue.maxValue;
    }
    return false;
};

const isDateValuePassedFilter = (
    value: string,
    filterValue: { startDate: string; endDate: string }
) => {
    const dateValue = moment(value, C.DATE_FORMAT);
    if (filterValue.endDate && filterValue.startDate) {
        return (
            dateValue >= moment(filterValue.startDate) &&
            dateValue <= moment(filterValue.endDate)
        );
    } else if (filterValue.endDate) {
        return dateValue <= moment(filterValue.endDate);
    } else if (filterValue.startDate) {
        return dateValue >= moment(filterValue.startDate);
    }
    return false;
};

const isTextValuePassedFilter = (value: string, filterValue: string) => {
    const textValue = value.toString().toLowerCase();
    return textValue.includes(filterValue.toLowerCase());
};

const isValuePassedFilter = (
    columnValueType: ColumnValueType,
    value: any,
    filterValue: any
) => {
    let result: boolean = false;
    if (value !== undefined && filterValue !== undefined) {
        switch (columnValueType) {
            case COLUMN_TYPE.NUMBER:
                result = isNumberValuePassedFilter(value, filterValue);
                break;
            case COLUMN_TYPE.DATE:
                result = isDateValuePassedFilter(value, filterValue);
                break;
            default:
                result = isTextValuePassedFilter(value, filterValue);
                break;
        }
    }
    return result;
};

export const filterTableRows = (
    props: TableProps,
    state: ShipTableState,
    tableRows: Array<RowType>
) => {
    return tableRows.filter((row) => {
        if (row.id === C.FILTER_ROW_ID) {
            return true;
        }
        let isFilterPassed: boolean = true;
        Object.keys(state.searchInfo).forEach((columnId) => {
            const columnType = getColumnValueType(props, columnId);
            const value = row.data[columnId]?.value;
            const filterValue = state.searchInfo[columnId];
            isFilterPassed =
                isFilterPassed &&
                isValuePassedFilter(columnType, value, filterValue);
        });
        return isFilterPassed;
    });
};
