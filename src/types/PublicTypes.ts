import { RefObject } from 'react';
import {
    ColumnType as BSColumnType,
    // @ts-ignore
    RowType,
    // @ts-ignore
    RendererProps,
    // @ts-ignore
    TableDataType,
} from 'react-bs-table';
import { SearchInfoType, SortInfoType } from './PrivateTypes';

export type RowType = RowType;

export type RendererProps = RendererProps;

export type TableDataType = TableDataType;

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
    showLogs?: boolean;
    search?: boolean;
    searchType?: SearchMode;
    pagination?: boolean;
    paginationType?: PaginationMode;
    sorting?: boolean;
    sortingType?: SortMode;
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
    customFilterOptions?: CustomFilterOptions;
    sortEnable?: boolean;
}

export type CustomFilterOptions = {
    renderer: (
        rendererProps: RendererProps,
        tableDataProps: TableDataProps
    ) => JSX.Element;
    filterFunc: (
        rowValue: any,
        filterValue: any,
        rowData: RowType['data']
    ) => boolean;
};

export type ColumnValueType = 'date' | 'number' | 'text' | 'custom' | undefined;
export type SearchMode = 'front' | 'back';
export type SortMode = 'front' | 'back';
export type PaginationMode = 'front' | 'back';
