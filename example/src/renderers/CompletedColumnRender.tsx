import { Component } from 'react'
import {
    RendererProps
} from 'ts-ship-table'

class CompletedColumnRender extends Component<RendererProps> {
    render() {
        if (this.props.rowData.data.completed !== undefined && this.props.rowData.data.completed.value) {
            return 'Да'
        } else {
            return 'Нет'
        }
    }
}

export default CompletedColumnRender
