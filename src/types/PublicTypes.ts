import { RefObject } from 'react'
import {
    ColumnType as BSColumnType,
    RowType as BSRowType,
    RendererProps as BSRendererProps,
    HeaderRendererProps as BSHeaderRendererProps, TableDataType
} from 'react-bs-table'

export interface RowType extends BSRowType{}

export interface RendererProps extends BSRendererProps{}

export interface HeaderRendererProps extends BSHeaderRendererProps{}

export interface AxiosConfigType {
  headers: {[key: string]: any}
}

export interface TableProps extends BSTableProps{
    // requestConfig?: RequestFuncOptions | ((success: (response: AxiosResponse) => void, requestParams: {[key: string]: any}) => void),
    // responseTransformer?: (arg0: AxiosResponse) => TransformedResponseData
    updateTableData: (requestArgs: { [key: string]: any }) => void,
    transformedResponseData: TransformedResponseData,
    options?: TableOptions,
    ref?: RefObject<any>,
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

export interface RequestFuncOptions {
    dataUrl: string,
    urlParams?: {[key: string]: any},
    axiosConfig?: AxiosConfigType,
}

export interface TableOptions {
    styledTable?: boolean,
    testSwitch?: boolean,
    search?: boolean,
    pagination?: boolean,
    sorting?:boolean,
}

export interface TransformedResponseData {
    rows: Array<RowType>,
    totalRowQuantity: number
}

export interface ColumnType extends BSColumnType{
    filterEnabled?: boolean,
    filterType?: 'text' | 'date' | 'number'
}
