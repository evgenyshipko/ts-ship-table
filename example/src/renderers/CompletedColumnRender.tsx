import React, { Component } from 'react'
import {
    RendererProps
} from 'ts-ship-table'
import { Button } from 'antd'

class CompletedColumnRender extends Component<RendererProps> {
    render() {
        if (this.props.rowData.data.completed !== undefined && this.props.rowData.data.completed.value) {
            return (
                <Button onClick={() => { console.log(this.props.tableData) }}>
                    Да
                </Button>
            )
        } else {
            return (
                // eslint-disable-next-line react/jsx-handler-names
                <Button onClick={this.props.tableData.props?.render}>
                    Нет
                </Button>
            )
        }
    }
}

export default CompletedColumnRender
