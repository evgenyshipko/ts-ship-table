import React, { Component } from 'react'
import { Input } from 'antd'
import { RendererProps } from 'react-bs-table'

const { Search } = Input
class RenderTextFilterCell extends Component<RendererProps> {
    render() {
        if (this.props.tableData.props !== undefined) {
            return (
                <Search
                    defaultValue={this.props.tableData.props.searchInfo[this.props.columnId]}
                    onChange={(e) => {
                        if (this.props.tableData.props !== undefined) {
                            this.props.tableData.props.setSearchInfo(this.props.columnId, e.target.value)
                        }
                    }}
                    onSearch={() => {
                        if (this.props.tableData.props !== undefined) {
                            this.props.tableData.props.updateTableData()
                        }
                    }}
                />
            )
        } else {
            return <></>
        }
    }
}

export default RenderTextFilterCell
