import React, { Component } from 'react'
import { Button, InputNumber } from 'antd'
import { RendererProps } from 'react-bs-table'
import {
    SearchOutlined,
    UndoOutlined
} from '@ant-design/icons'

interface NumberInfoType {
    minValue?: undefined | number,
    maxValue?: undefined | number
}

class RenderNumberFilterCell extends Component<RendererProps> {
    handleChangeNumber = (minValue: any, maxValue: any) => {
        const numberInfo: NumberInfoType = {}
        if (minValue != null) {
            numberInfo.minValue = minValue
        }
        if (maxValue != null) {
            numberInfo.maxValue = maxValue
        }
        if (this.props.tableData.props !== undefined) {
            const columnId = this.props.columnId
            const searchInfo = this.props.tableData.props.searchInfo[columnId]

            this.props.tableData.props.setSearchInfo(
                columnId,
                minValue == null && maxValue == null ? undefined : { ...searchInfo, ...numberInfo }
            )
        }

        if (this.props.tableData.props !== undefined) {
            console.log('this.props.tableData.props.searchInfo')
            console.log(this.props.tableData.props.searchInfo)
        }
    }

    updateTableDataBySearch = () => {
        if (this.props.tableData.props !== undefined) {
            this.props.tableData.props.updateTableData()
        }
    }

    render() {
        if (this.props.tableData.props !== undefined) {
            const min = this.props.tableData.props.searchInfo[this.props.columnId]?.minValue
            const max = this.props.tableData.props.searchInfo[this.props.columnId]?.maxValue

            return (
                <div className='ship-number-filter-table-div'>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <InputNumber
                                        className='input-min-value'
                                        value={min}
                                        max={max}
                                        onChange={(value) => {
                                            this.handleChangeNumber(value, null)
                                        }}
                                        placeholder='От'
                                    />
                                </td>
                                <td>
                                    <Button
                                        className='number-filter-cell-search-btn'
                                        onClick={() => {
                                            this.updateTableDataBySearch()
                                        }}
                                        icon={<SearchOutlined />}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputNumber
                                        className='input-max-value'
                                        value={max}
                                        min={min}
                                        onChange={(value) => {
                                            this.handleChangeNumber(null, value)
                                        }}
                                        placeholder='До'
                                    />
                                </td>
                                <td>
                                    <Button
                                        className='number-filter-cell-undo-btn'
                                        onClick={() => {
                                            this.handleChangeNumber(null, null)
                                        }}
                                        icon={<UndoOutlined />}
                                    />
                                </td>
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

export default RenderNumberFilterCell
