import React, { Component } from 'react'
import { Table } from 'react-bs-tree-table'
import {
    PaginationInfoType,
    SearchInfoType,
    SortInfoType,
    TableDataTypeExtended
} from '../types/PrivateTypes'

import {
    RowType,
    TableProps, TransformedResponseData
} from '../types/PublicTypes'

import { Button, Pagination, Spin } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import { renderFilterCell, renderHeaderWarehouseTable } from '../renderers/ShipTableRenderers'
import TextSwitch from './TextSwitch'
import 'antd/dist/antd.css'
import '../styles/ship_styles.css'

interface State {
    prevPropsId: undefined | number | string
    transformedTableData: Array<RowType>,
    paginationInfo: PaginationInfoType,
    searchInfo: SearchInfoType,
    sortInfo: SortInfoType,
    isTestModeActive: boolean,
    isSearchActive: boolean,
    isDataLoadingSpinActive: boolean
}

class ShipTable extends Component<TableProps> {
    state: State = {
        prevPropsId: undefined,
        transformedTableData: [],
        isSearchActive: false,
        isTestModeActive: false,
        searchInfo: {},
        isDataLoadingSpinActive: false,
        paginationInfo: {
            pageNumber: 1,
            recordsPerPage: 10,
            totalRecordsQuantity: 50
        },
        sortInfo: {
            columnId: undefined,
            asc: undefined
        }
    }

    componentDidMount() {
        this.updateTableData()
    }

    componentDidUpdate(prevProps : TableProps) {
        if (
            this.props.isPaginationNeeded !== prevProps.isPaginationNeeded ||
            this.props.isSearchNeeded !== prevProps.isSearchNeeded ||
            this.props.isTestSwitchNeeded !== prevProps.isTestSwitchNeeded
        ) {
            this.updateTableData()
        }
    }

    updateTableData = () => {
        this.toggleDataLoadingSpin()
        const path = this.props.dataEndPointPath + this.getRequestWarehouseDataParams()
        console.log('updateTableData')
        console.log(`request path: ${path}`)

        let axiosConfig = this.props.axiosConfig
        if (axiosConfig === undefined) {
            axiosConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }

        axios.get(path, axiosConfig)
            .then(res => {
                const recordsPerPage = this.state.paginationInfo.recordsPerPage
                const pageNumber = this.state.paginationInfo.pageNumber
                const responseData = res.data

                let transformedTableData: TransformedResponseData
                if (this.props.transformResponseDataFunc !== undefined) {
                    transformedTableData = this.props.transformResponseDataFunc(responseData)
                } else {
                    transformedTableData = responseData
                }

                const newRecordsQuantity = transformedTableData.totalRowQuantity

                if (this.isPaginationOnBackEnd(transformedTableData)) {
                    if (
                        this.props.isPaginationNeeded &&
                        recordsPerPage !== undefined &&
                        Math.ceil(newRecordsQuantity / recordsPerPage) < pageNumber &&
                        newRecordsQuantity !== 0
                    ) {
                        this.state.paginationInfo.pageNumber = 1
                        this.setState(this.state)
                        this.updateTableData()
                    }
                } else {
                    if (responseData !== undefined) {
                        if (this.props.isPaginationNeeded && recordsPerPage !== undefined) {
                            transformedTableData.rows = transformedTableData.rows.slice((pageNumber - 1) * recordsPerPage, pageNumber * recordsPerPage)
                        }
                    }
                }

                this.setState({
                    transformedTableData: transformedTableData.rows,
                    paginationInfo: { ...this.state.paginationInfo, totalRecordsQuantity: newRecordsQuantity }
                })

                this.updateWarehouseTableDataByFilterRow()
                this.toggleDataLoadingSpin()
            })
    }

    isPaginationOnBackEnd = (data: TransformedResponseData) => {
        if (data.rows.length === this.state.paginationInfo.recordsPerPage) {
            return true
        } else {
            return false
        }
    }

    getRequestWarehouseDataParams = () => {
        let params = '?test_mode=' + this.state.isTestModeActive
        if (this.props.isPaginationNeeded) {
            params += '&records_per_page=' + this.state.paginationInfo.recordsPerPage + '&page_number=' + this.state.paginationInfo.pageNumber
        }
        if (Object.keys(this.state.searchInfo).length > 0) {
            params += '&search_info=' + JSON.stringify(this.state.searchInfo)
        }
        if (this.state.sortInfo.columnId !== undefined) {
            params += '&sort_data=' + JSON.stringify({ column: this.state.sortInfo.columnId, asc: this.state.sortInfo.asc })
        }
        return params
    }

    handlePaginationParameters = (current: number, pageSize: number | undefined) => {
        this.state.paginationInfo = { ...this.state.paginationInfo, pageNumber: current, recordsPerPage: pageSize! }
        this.setState(this.state)
        this.updateTableData()
    }

    toggleSearchActive = () => {
        this.state.isSearchActive = !this.state.isSearchActive
        this.setState(this.state)
        this.updateWarehouseTableDataByFilterRow()
    }

    toggleDataLoadingSpin = () => {
        this.state.isDataLoadingSpinActive = !this.state.isDataLoadingSpinActive
        this.setState(this.state)
    }

    updateWarehouseTableDataByFilterRow = () => {
        const filterRowId: string = 'filter'
        if (this.state.isSearchActive) {
            const data: any = { id: filterRowId, 'tr-el': { class: 'wms-table-filter-row' } }
            this.props.columnList.forEach((columnData) => {
                const columnId = columnData.field
                if (columnData.filterEnabled) {
                    data[columnId] = { render: renderFilterCell }
                }
            })
            this.state.transformedTableData.unshift(data)
            this.setState(this.state)
        } else {
            const index = this.state.transformedTableData.findIndex((warehouseRowData) => {
                return warehouseRowData.id === filterRowId
            })
            if (index >= 0) {
                this.state.transformedTableData.splice(index, 1)
            }
            this.setState(this.state)
        }

        console.log('updateWarehouseTableDataByFilterRow')
        console.log(this.state.transformedTableData)
    }

    toggleSortInfo = (columnId: string) => {
        const sortInfo = this.state.sortInfo
        if (sortInfo.columnId === columnId) {
            sortInfo.asc = !sortInfo.asc
        } else {
            sortInfo.columnId = columnId
            sortInfo.asc = true
        }
        this.setState(this.state)
    }

    setSearchInfo = (columnId: string, value: any) => {
        if (value !== '') {
            this.state.searchInfo[columnId] = value
        } else {
            delete this.state.searchInfo[columnId]
        }
        this.setState(this.state)
    }

    handleTestMode = () => {
        this.state.isTestModeActive = !this.state.isTestModeActive
        this.setState(this.state)
        this.updateTableData()
    }

    render() {

        const columnList = this.props.columnList.map((columnInfo) => {
            columnInfo.renderer = renderHeaderWarehouseTable
            return columnInfo
        })

        const tableDataList = this.state.transformedTableData
        const tableData: TableDataTypeExtended = {
            columns: columnList,
            data: tableDataList,
            searchInfo: this.state.searchInfo,
            sortInfo: this.state.sortInfo,
            setSearchInfo: this.setSearchInfo,
            updateTableData: this.updateTableData,
            toggleSortInfo: this.toggleSortInfo,
            isSortingNeeded: this.props.isSortingNeeded
        }

        let pagination = <></>
        if (tableDataList.length > 0 && this.props.isPaginationNeeded) {
            pagination = (
                <Pagination
                    showSizeChanger
                    onChange={this.handlePaginationParameters}
                    onShowSizeChange={this.handlePaginationParameters}
                    defaultCurrent={this.state.paginationInfo.pageNumber}
                    current={this.state.paginationInfo.pageNumber}
                    pageSize={this.state.paginationInfo.recordsPerPage}
                    total={this.state.paginationInfo.totalRecordsQuantity}
                />
            )
        }

        let testModeToggleDiv = <></>
        if (this.props.isTestSwitchNeeded) {
            testModeToggleDiv = (
                <div className='textSwitchDiv'>
                    <TextSwitch
                        text='Тест'
                        onChange={this.handleTestMode}
                        isDefaultChecked={this.state.isTestModeActive}
                    />
                </div>
            )
        }

        let spin = <></>
        if (this.state.isDataLoadingSpinActive) {
            spin = (
                <Spin
                    className='loadingSpin'
                    size='large'
                />
            )
        }

        let searchButton = <></>
        if (this.props.isSearchNeeded) {
            searchButton = (
                <Button
                    icon={<SearchOutlined />}
                    className='searchBtn'
                    onClick={() => {
                        this.toggleSearchActive()
                    }}
                >
                    Поиск
                </Button>
            )
        }

        return (
            <div className='mainTableDiv'>
                <div className='firstLine'>
                    {testModeToggleDiv}
                    {spin}
                    {searchButton}
                    {pagination}
                </div>
                <div>
                    <Table tableData={tableData} />
                </div>
            </div>
        )
    }
}

export { ShipTable }
