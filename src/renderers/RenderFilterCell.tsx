import React, { Component } from 'react'
import { Input } from 'antd'
import { InternalRendererProps } from '../types/PrivateTypes'

const { Search } = Input
class RenderFilterCell extends Component<InternalRendererProps> {
    render() {
        return (
            <Search
                defaultValue={this.props.tableData.searchInfo[this.props.columnId]}
                onChange={(e) => {
                    this.props.tableData.setSearchInfo(this.props.columnId, e.target.value)
                }}
                onSearch={() => {
                    this.props.tableData.updateTableData()
                }}
            />
        )
    }
}

export default RenderFilterCell
