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

    handleChangeStartDate = (startDate: moment.Moment | null) => {
        const columnId = this.props.columnId
        if (this.props.tableData.props !== undefined) {
            let searchInfo = this.props.tableData.props.searchInfo[columnId]
            if (searchInfo === undefined) {
                searchInfo = {}
            }
            if (startDate != null) {
                searchInfo.startDate = startDate.format('YYYY-MM-DD')
            } else {
                delete searchInfo.startDate
            }
            this.props.tableData.props.setSearchInfo(columnId, searchInfo)
        }
    }

    handleChangeEndDate = (endDate: moment.Moment | null) => {
        const columnId = this.props.columnId
        if (this.props.tableData.props !== undefined) {
            let searchInfo = this.props.tableData.props.searchInfo[columnId]
            if (searchInfo === undefined) {
                searchInfo = {}
            }
            if (endDate != null) {
                searchInfo.endDate = endDate.format('YYYY-MM-DD')
            } else {
                delete searchInfo.endDate
            }
            this.props.tableData.props.setSearchInfo(columnId, searchInfo)
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
            let endDate = this.props.tableData.props.searchInfo[this.props.columnId]?.endDate
            let startDate = this.props.tableData.props.searchInfo[this.props.columnId]?.startDate
            if (endDate !== undefined) {
                endDate = moment(endDate, 'YYYY-MM-DD')
            }
            if (startDate !== undefined) {
                startDate = moment(startDate, 'YYYY-MM-DD')
            }

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
                        this.handleChangeStartDate(null)
                        this.handleChangeEndDate(null)
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
                    onChange={(eventStartDate: moment.Moment) => {
                        this.handleChangeStartDate(eventStartDate)
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
                    onChange={(eventEndDate: moment.Moment) => {
                        this.handleChangeEndDate(eventEndDate)
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
                <div className='ship-date-filter-table-div'>
                    <table>
                        <tbody>
                            <tr>
                                <td>{startDatePicker}</td>
                                <td>{searchButton}</td>
                            </tr>
                            <tr>
                                <td>{endDatePicker}</td>
                                <td>{cancelButton}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return <></>
        }
    }
}

export default RenderDateFilterCell
