import { RefObject } from 'react'
import { AxiosResponse } from 'axios'
import {
    ColumnType as BSColumnType,
    RowType as BSRowType,
    RendererProps as BSRendererProps,
    HeaderRendererProps as BSHeaderRendererProps
} from 'react-bs-table'

export interface RowType extends BSRowType{}

export interface RendererProps extends BSRendererProps{}

export interface HeaderRendererProps extends BSHeaderRendererProps{}

export interface AxiosConfigType {
  headers: {[key: string]: any}
}

export interface TableProps {
  id: string | number,
  dataEndPointPath: string,
  columnList: Array<ColumnType>,
  transformResponseDataFunc?: (arg0: AxiosResponse) => TransformedResponseData
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

export interface ColumnType extends BSColumnType{
    filterEnabled?: boolean
}
