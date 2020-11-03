import React, { Component } from 'react'
import { RendererProps } from 'react-bs-table'
import moment from 'moment'

class DateRenderer extends Component<RendererProps> {
    render() {
        const dateValue = this.props.rowData.data[this.props.columnId]?.value
        if (dateValue !== undefined && dateValue !== null) {
            const date = moment(dateValue, 'YYYY-MM-DD')
            return <div>{date.format('YYYY-MM-DD')}</div>
        }
        return <></>
    }
}

export default DateRenderer
