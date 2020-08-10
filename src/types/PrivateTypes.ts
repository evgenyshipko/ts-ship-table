
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
