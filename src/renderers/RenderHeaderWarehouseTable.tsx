import React, { Component } from 'react'
import { InternalHeaderRendererProps } from '../types/PrivateTypes'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'

class RenderHeaderWarehouseTable extends Component<InternalHeaderRendererProps> {
    render() {
        if (this.props.tableData.isSortingNeeded) {
            let sortIcon = <></>

            if (this.props.tableData.sortInfo.columnId === this.props.columnInfo.field) {
                if (this.props.tableData.sortInfo.asc) {
                    sortIcon = <SortAscendingOutlined />
                } else {
                    sortIcon = <SortDescendingOutlined />
                }
            }

            return (
                <>
                    <span onClick={() => {
                        this.props.tableData.toggleSortInfo(this.props.columnInfo.field)
                        this.props.tableData.updateTableData()
                    }}
                    >
                        {this.props.columnInfo.title}
                    </span>
                    {sortIcon}
                </>
            )
        } else {
            return this.props.columnInfo.title
        }
    }
}

export default RenderHeaderWarehouseTable
