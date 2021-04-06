import { RefObject } from 'react';
import {
    ColumnType as BSColumnType,
    RowType,
    RendererProps,
    TableDataType,
} from 'react-bs-table';
import { SearchInfoType, SortInfoType } from './PrivateTypes';

export { RowType, RendererProps };

export interface TableProps extends BSTableProps {
    id: string;
    tableData: ResponseTableData;
    updateTableData?: (requestArgs: Record<string, any>) => void;
    options?: TableOptions;
    ref?: RefObject<any>;
    jsxElementsToHeader?: Array<JSX.Element>;
}

export interface BSTableProps {
    columns: Array<ColumnType>;
    defaultCellStyle?:
        | ((
              tableData: TableDataType,
              rowData: RowType,
              columnId: string
          ) => Record<string, string>)
        | Record<string, string>;
    style?:
        | ((tableData: TableDataType) => Record<string, string>)
        | Record<string, string>;
    class?: ((tableData: TableDataType) => string) | string;
    props?: Record<string, any>;
}

export interface TableOptions {
    styledTable?: boolean;
    testSwitch?: boolean;
    search?: boolean;
    searchType?: SearchMode;
    pagination?: boolean;
    sorting?: boolean;
    sortingType?: SortMode;
    showLogs?: boolean;
}

export interface ResponseTableData {
    rows: Array<RowType>;
    totalRowQuantity: number;
}

export interface TableDataProps {
    searchInfo: SearchInfoType;
    sortInfo: SortInfoType;
    setSearchInfo: (columnId: string, value: any) => void;
    updateTableData: () => void;
    toggleSortInfo: (columnId: string) => void;
    sorting?: boolean;
    forceUpdate: () => void;
}

export interface ColumnType extends BSColumnType {
    columnValueType?: ColumnValueType;
    customFilterRenderer?: (
        rendererProps: RendererProps,
        tableDataProps: TableDataProps
    ) => JSX.Element;
    sortEnable?: boolean;
}

export type ColumnValueType = 'date' | 'number' | 'text' | undefined;
export type SearchMode = 'front' | 'back';
export type SortMode = 'front' | 'back';
