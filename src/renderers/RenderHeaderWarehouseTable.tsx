import React, { Component } from 'react'
import { HeaderRendererProps } from 'react-bs-table'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'

class RenderHeaderWarehouseTable extends Component<HeaderRendererProps> {
    render() {
        if (
            this.props.tableData.props !== undefined &&
            this.props.tableData.props.sorting
        ) {
            let sortIcon = <></>

            if (this.props.tableData.props.sortInfo.columnId === this.props.columnInfo.field) {
                if (this.props.tableData.props.sortInfo.asc) {
                    sortIcon = <SortAscendingOutlined />
                } else {
                    sortIcon = <SortDescendingOutlined />
                }
            }

            return (
                <>
                    <span onClick={() => {
                        if (this.props.tableData.props !== undefined) {
                            this.props.tableData.props.toggleSortInfo(this.props.columnInfo.field)
                            this.props.tableData.props.updateTableData()
                        }
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
