import { TableDataType } from 'react-bs-table'
import { RendererProps, HeaderRendererProps } from './PublicTypes'

export interface PaginationInfoType {
    pageNumber: number,
    recordsPerPage: number,
    totalRecordsQuantity: number,
}

export interface SortInfoType {
    columnId: string | undefined,
    asc: boolean | undefined,
}

export interface SearchInfoType {
    [key: string]: any
}

export interface TableDataTypeExtended extends TableDataType{
    searchInfo: SearchInfoType,
    sortInfo: SortInfoType,
    setSearchInfo: any,
    updateTableData: any,
    toggleSortInfo: any,
    isSortingNeeded: boolean | undefined
}

export interface InternalRendererProps extends RendererProps{
    tableData: TableDataTypeExtended
}

export interface InternalHeaderRendererProps extends HeaderRendererProps{
    tableData: TableDataTypeExtended
}
