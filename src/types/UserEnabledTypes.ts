export interface ColumnItemType {
    field: string,
    title: string,
    filterEnabled: boolean,
    class?: string,
    funcRenderer?: (tableData: TableDataType, headerInfo: ColumnItemType) => any
}

export interface TransformedColumnDataType {
    id: any,
    [key: string]: TransformedColumnDataTypeValue
}

export interface TransformedColumnDataTypeValue {
    value: any,
    funcRenderer?: (tableData: TableDataType, rowData: TransformedColumnDataType, columnId: string) => any
}

export interface AxiosConfigType {
    headers: {[key: string]: any},
}

export interface TableDataType {
    columns: Array<ColumnItemType>,
    data: Array<TransformedColumnDataType>,
}

export interface TableProps {
    id: string | number
    dataEndPointPath: string
    columnList: Array<ColumnItemType>
    transformResponseDataFunc: (...args: Array<any>) => Array<TransformedColumnDataType>,
    axiosConfig: AxiosConfigType,
    isTestSwitchNeeded: boolean,
    isSearchNeeded: boolean,
    isPaginationNeeded: boolean,
}
