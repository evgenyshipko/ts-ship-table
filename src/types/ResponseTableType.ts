import { TableDataType } from './UserEnabledTypes'

export interface PaginationInfoType {
    pageNumber: number,
    recordsPerPage: number | undefined,
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
    toggleSortInfo: any
}
