import { RefObject } from 'react'

export interface RowType {
  id: any,
  [key: string]: CellType
}

export interface CellType {
  value: any,
  funcRenderer?: (tableData: TableDataType, rowData: RowType, columnId: string) => any,
  render?: (props: any) => any,
}

export interface TableDataType {
  columns: Array<ColumnItemType>,
  data: Array<RowType>,
}

export interface ColumnItemType {
  field: string,
  title: string,
  filterEnabled: boolean,
  class?: string,
  funcRenderer?: (tableData: TableDataType, headerInfo: ColumnItemType) => any,
  renderer?: (props: any) => any,
}

export interface AxiosConfigType {
  headers: {[key: string]: any}
}

export interface TableProps {
  id: string | number,
  dataEndPointPath: string,
  columnList: Array<ColumnItemType>,
  transformResponseDataFunc?: (...args: any) => TransformedResponseData
  axiosConfig?: AxiosConfigType,
  isTestSwitchNeeded?: boolean,
  isSearchNeeded?: boolean,
  isPaginationNeeded?: boolean,
  isSortingNeeded?:boolean,
  ref?: RefObject<any>
}

export interface TransformedResponseData {
    rows: Array<RowType>,
    totalRowQuantity: number
}
