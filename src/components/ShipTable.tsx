import React, { Component } from 'react'
import { Table, RowType, TableDataType } from 'react-bs-table'
import { Button, Pagination, Spin } from 'antd'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import TextSwitch from './TextSwitch'
import 'antd/dist/antd.css'
import '../styles/ship_styles.css'
import '../styles/renderers.css'
import RenderHeaderWarehouseTable from '../renderers/RenderHeaderWarehouseTable'
import RenderTextFilterCell from '../renderers/RenderTextFilterCell'
import RenderDateFilterCell from '../renderers/RenderDateFilterCell'

import {
    PaginationInfoType,
    SearchInfoType,
    SortInfoType
} from '../types/PrivateTypes'

import {
    TableProps,
    TransformedResponseData
} from '../types/PublicTypes'
import RenderNumberFilterCell from '../renderers/RenderNumberFilterCell'

interface State {
    prevPropsId: undefined | number | string
    transformedTableRows: Array<RowType>,
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
        transformedTableRows: [],
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
            .then(response => {
                let responseTableData: TransformedResponseData
                if (this.props.transformResponseDataFunc !== undefined) {
                    responseTableData = this.props.transformResponseDataFunc(response)
                } else {
                    responseTableData = response.data
                }

                const totalRecordsQuantity = responseTableData.totalRowQuantity
                if (this.props.isPaginationNeeded) {
                    const recordsPerPage = this.state.paginationInfo.recordsPerPage
                    const pageNumber = this.state.paginationInfo.pageNumber

                    if (
                        Math.ceil(totalRecordsQuantity / recordsPerPage) < pageNumber &&
                    totalRecordsQuantity !== 0
                    ) {
                        this.state.paginationInfo.pageNumber = 1
                        this.setState(this.state)
                        this.updateTableData()
                    }

                    if (this.isPaginationOnFrontEnd(responseTableData)) {
                        responseTableData.rows = responseTableData.rows.slice((pageNumber - 1) * recordsPerPage, pageNumber * recordsPerPage)
                    }
                }

                this.setState({
                    transformedTableRows: responseTableData.rows,
                    paginationInfo: { ...this.state.paginationInfo, totalRecordsQuantity: totalRecordsQuantity }
                })

                this.updateWarehouseTableDataByFilterRow()
                this.toggleDataLoadingSpin()
            })
    }

    isPaginationOnFrontEnd = (data: TransformedResponseData) => {
        if (data.rows.length <= this.state.paginationInfo.recordsPerPage) {
            return false
        } else {
            return true
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
            const row: any = { id: filterRowId, 'tr-el': { class: 'wms-table-filter-row' }, data: {} }
            this.props.columnList.forEach((columnData) => {
                const columnId = columnData.field

                switch (columnData.filterType) {
                case 'text':
                    row.data[columnId] = { renderer: RenderTextFilterCell }
                    break
                case 'date':
                    row.data[columnId] = { renderer: RenderDateFilterCell }
                    break
                case 'number':
                    row.data[columnId] = { renderer: RenderNumberFilterCell }
                    break
                }
            })

            this.state.transformedTableRows.unshift(row)
            this.setState(this.state)
        } else {
            const index = this.state.transformedTableRows.findIndex((warehouseRowData) => {
                return warehouseRowData.id === filterRowId
            })
            if (index >= 0) {
                this.state.transformedTableRows.splice(index, 1)
            }
            this.setState(this.state)
        }

        console.log('updateWarehouseTableDataByFilterRow')
        console.log(this.state.transformedTableRows)
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
            columnInfo.renderer = RenderHeaderWarehouseTable
            return columnInfo
        })

        const transformedRows = this.state.transformedTableRows
        const tableDataProps = {
            searchInfo: this.state.searchInfo,
            sortInfo: this.state.sortInfo,
            setSearchInfo: this.setSearchInfo,
            updateTableData: this.updateTableData,
            toggleSortInfo: this.toggleSortInfo,
            isSortingNeeded: this.props.isSortingNeeded
        }

        const tableData: TableDataType = {
            columns: columnList,
            rows: transformedRows,
            props: tableDataProps
        }

        let pagination = <></>
        if (transformedRows.length > 0 && this.props.isPaginationNeeded) {
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
