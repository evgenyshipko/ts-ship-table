import { Component } from 'react'
import {
    RenderProps
} from 'ts-ship-table'

class CompletedColumnRender extends Component<RenderProps> {
    render() {
        if (this.props.rowData.completed.value) {
            return 'Да'
        } else {
            return 'Нет'
        }
    }
}

export default CompletedColumnRender
