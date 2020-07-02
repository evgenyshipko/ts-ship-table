import React from 'react'
import { Input } from 'antd'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'

const { Search } = Input

export const renderFilterCell = (props: any) => {
    return (
        <Search
            defaultValue={props.tableData.searchInfo[props.columnId]}
            onChange={(e) => {
                props.tableData.setSearchInfo(props.columnId, e.target.value)
            }}
            onSearch={() => {
                props.tableData.updateTableData()
            }}
        />
    )
}

export const renderHeaderWarehouseTable = (props: any) => {
    if (props.tableData.isSortingNeeded) {
        let sortIcon = <></>

        if (props.tableData.sortInfo.columnId === props.headerInfo.field) {
            if (props.tableData.sortInfo.asc) {
                sortIcon = <SortAscendingOutlined />
            } else {
                sortIcon = <SortDescendingOutlined />
            }
        }

        return (
            <>
                <span onClick={() => {
                    props.tableData.toggleSortInfo(props.headerInfo.field)
                    props.tableData.updateTableData()
                }}
                >
                    {props.headerInfo.title}
                </span>
                {sortIcon}
            </>
        )
    } else {
        return props.headerInfo.title
    }
}
