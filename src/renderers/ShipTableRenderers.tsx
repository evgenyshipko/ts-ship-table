import React from 'react'
import { Input } from 'antd'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import { TableDataTypeExtended } from '../types/ResponseTableType'
import { TransformedColumnDataType } from '../types/UserEnabledTypes'

const { Search } = Input

// @ts-ignore
export const renderFilterCell = (tableData: TableDataTypeExtended, rowData: TransformedColumnDataType, columnId: string) => {
    return (
        <Search
            defaultValue={tableData.searchInfo[columnId]}
            onChange={(e) => {
                tableData.setSearchInfo(columnId, e.target.value)
            }}
            onSearch={() => {
                tableData.updateTableData()
            }}
        />
    )
}

export const renderHeaderWarehouseTable = (tableData: TableDataTypeExtended, headerInfo:any) => {
    let sortIcon = <></>
    if (tableData.sortInfo.columnId === headerInfo.field) {
        if (tableData.sortInfo.asc) {
            sortIcon = <SortAscendingOutlined />
        } else {
            sortIcon = <SortDescendingOutlined />
        }
    }

    return (
        <>
            <span onClick={() => {
                tableData.toggleSortInfo(headerInfo.field)
                tableData.updateTableData()
            }}
            >
                {headerInfo.title}
            </span>
            {sortIcon}
        </>
    )
}
