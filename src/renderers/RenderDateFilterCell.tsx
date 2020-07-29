import React, { Component } from 'react'
import { RendererProps } from 'react-bs-table'
import moment from 'moment'
import { Button, DatePicker } from 'antd'
import { SearchOutlined, UndoOutlined } from '@ant-design/icons'

interface State {
    startDateVisible: boolean,
    endDateVisible: boolean,
}

class RenderDateFilterCell extends Component<RendererProps> {
    state: State = {
        startDateVisible: false,
        endDateVisible: false
    }

    dateFormat = 'DD/MM/YYYY'

    handleChangeDate = (startDate: moment.Moment | null, endDate: moment.Moment | null) => {
        const columnId = this.props.columnId
        const dateInfo: {
            startDate?: moment.Moment,
            endDate?: moment.Moment
        } = {}
        if (startDate != null) {
            dateInfo.startDate = moment(startDate.format('YYYY-MM-DD'), 'YYYY-MM-DD')
        }
        if (endDate != null) {
            dateInfo.endDate = moment(endDate.format('YYYY-MM-DD'), 'YYYY-MM-DD ')
                .add(23, 'hours').add(59, 'minutes').add(59, 'seconds')
        }
        if (this.props.tableData.props !== undefined) {
            const searchInfo = this.props.tableData.props.searchInfo[columnId]

            this.props.tableData.props.setSearchInfo(
                columnId,
                startDate == null && endDate == null ? undefined : { ...searchInfo, ...dateInfo }
            )
        }
    }

    updateTableDataBySearch = () => {
        if (this.props.tableData.props !== undefined) {
            this.props.tableData.props.updateTableData()
        }
    }

    handleStartDateOpenChange = () => {
        this.state.startDateVisible = !this.state.startDateVisible
        this.setState(this.state)
    }

    handleEndDateOpenChange = () => {
        this.state.endDateVisible = !this.state.endDateVisible
        this.setState(this.state)
    }

    render() {
        if (this.props.tableData.props !== undefined) {
            const endDate = this.props.tableData.props.searchInfo[this.props.columnId]?.endDate
            const startDate = this.props.tableData.props.searchInfo[this.props.columnId]?.startDate

            const searchButton = (
                <Button
                    className='date-filter-search-btn'
                    onClick={() => {
                        this.updateTableDataBySearch()
                    }}
                    icon={<SearchOutlined />}
                />
            )
            const cancelButton = (
                <Button
                    className='date-filter-undo-btn'
                    onClick={() => {
                        this.handleChangeDate(null, null)
                    }}
                    icon={<UndoOutlined />}
                />
            )

            const startDatePicker = (
                <DatePicker
                    className='start-date-picker'
                    value={startDate}
                    picker={undefined}
                    open={this.state.startDateVisible}
                    placeholder='Начало'
                    format={this.dateFormat}
                    onOpenChange={this.handleStartDateOpenChange}
                    onChange={(startDate: moment.Moment) => {
                        this.handleChangeDate(startDate, null)
                    }}
                    disabledDate={(currentDate: moment.Moment) => {
                        if (currentDate <= endDate || endDate === undefined) {
                            return false
                        } else {
                            return true
                        }
                    }}
                />
            )

            const endDatePicker = (
                <DatePicker
                    className='end-date-picker'
                    value={endDate}
                    picker={undefined}
                    open={this.state.endDateVisible}
                    placeholder='Окончание'
                    format={this.dateFormat}
                    onOpenChange={this.handleEndDateOpenChange}
                    onChange={(endDate: moment.Moment) => {
                        this.handleChangeDate(null, endDate)
                    }}
                    disabledDate={(currentDate: moment.Moment) => {
                        if (startDate <= currentDate || startDate === undefined) {
                            return false
                        } else {
                            return true
                        }
                    }}
                />
            )

            return (
                <div>
                    <div className='date-filter-cell-div-first-line'>
                        {startDatePicker}
                        {searchButton}
                    </div>
                    <div className='date-filter-cell-div-second-line'>
                        {endDatePicker}
                        {cancelButton}
                    </div>
                </div>
            )
        } else {
            return <></>
        }
    }
}

export default RenderDateFilterCell
