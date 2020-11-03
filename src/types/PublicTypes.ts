import { ComponentType, RefObject } from 'react'
import {
    ColumnType as BSColumnType,
    RowType as BSRowType,
    RendererProps as BSRendererProps,
    HeaderRendererProps as BSHeaderRendererProps, TableDataType
} from 'react-bs-table'

export interface RowType extends BSRowType{}

export interface RendererProps extends BSRendererProps{}

export interface HeaderRendererProps extends BSHeaderRendererProps{}

export interface TableProps extends BSTableProps{
    id: string,
    updateTableData: (requestArgs: { [key: string]: any }) => void,
    tableData: ResponseTableData,
    options?: TableOptions,
    ref?: RefObject<any>,
    jsxElementsToHeader?: Array<JSX.Element>
}

export interface BSTableProps {
    columns: Array<ColumnType>,
    defaultCellStyle?: ((tableData: TableDataType, rowData: RowType, columnId: string) => {
        [key: string]: string;
    }) | {
        [key: string]: string;
    };
    style?: ((tableData: TableDataType) => {
        [key: string]: string;
    }) | {
        [key: string]: string;
    };
    class?: ((tableData: TableDataType) => string) | string;
    props?: {
        [key: string]: any;
    };
}

export interface TableOptions {
    styledTable?: boolean,
    testSwitch?: boolean,
    search?: boolean,
    searchType?: SearchMode,
    pagination?: boolean,
    sorting?:boolean,
    sortingType?: SortMode,
    showLogs?:boolean
}

export interface ResponseTableData {
    rows: Array<RowType>,
    totalRowQuantity: number
}

export interface ColumnType extends BSColumnType{
    columnValueType?: ColumnValueType,
    customFilterRenderer?: ComponentType<RendererProps>,
    sortEnable?: boolean
}

export type ColumnValueType = 'date' | 'number' | 'text' | undefined
export type SearchMode = 'front' | 'back'
export type SortMode = 'front' | 'back'
