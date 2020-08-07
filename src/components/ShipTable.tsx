import React, { Component } from 'react'
import { Table, RowType, TableDataType } from 'react-bs-table'
import { Button, Pagination, Spin } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import TextSwitch from './TextSwitch'
import 'antd/dist/antd.css'
import '../styles/table.css'
import '../styles/other.css'
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
            this.props.options?.pagination !== prevProps.options?.pagination ||
            this.props.options?.search !== prevProps.options?.search ||
            this.props.options?.testSwitch !== prevProps.options?.testSwitch
        ) {
            this.updateTableData()
        }
    }

    successFunc = (response: AxiosResponse) => {
        let responseTableData: TransformedResponseData
        if (this.props.responseTransformer !== undefined) {
            responseTableData = this.props.responseTransformer(response)
        } else {
            responseTableData = response.data
        }

        const totalRecordsQuantity = responseTableData.totalRowQuantity
        if (this.props.options?.pagination) {
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
    }

    updateTableData = () => {
        this.toggleDataLoadingSpin()
        console.log('updateTableData')

        if (typeof this.props.requestConfig !== 'object') {
            this.props.requestConfig(this.successFunc, this.getRequestDataParams())
        } else {
            const path = this.props.requestConfig.dataUrl + this.getRequestDataParamsString()
            let axiosConfig = this.props.requestConfig.axiosConfig
            if (axiosConfig === undefined) {
                axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }

            console.log(`request path: ${path}`)
            axios.get(path, axiosConfig).then(response => {
                this.successFunc(response)
            })
        }
    }

    isPaginationOnFrontEnd = (data: TransformedResponseData) => {
        if (data.rows.length <= this.state.paginationInfo.recordsPerPage) {
            return false
        } else {
            return true
        }
    }

    getRequestDataParams = () => {
        let params: any = { testMode: this.state.isTestModeActive }
        if (this.props.options?.pagination) {
            params.recordsPerPage = this.state.paginationInfo.recordsPerPage
            params.pageNumber = this.state.paginationInfo.pageNumber
        }
        if (Object.keys(this.state.searchInfo).length > 0) {
            params.searchInfo = this.state.searchInfo
        }
        if (this.state.sortInfo.columnId !== undefined) {
            params.sortData = { column: this.state.sortInfo.columnId, asc: this.state.sortInfo.asc }
        }
        if (typeof this.props.requestConfig === 'object') {
            const urlParams = this.props.requestConfig.urlParams
            if (urlParams !== undefined) {
                params = { ...params, ...urlParams }
            }
        }
        return params
    }

    getRequestDataParamsString = () => {
        let paramsStr: string = ''
        const paramsObj = this.getRequestDataParams()
        if (paramsObj !== undefined) {
            Object.keys(paramsObj).forEach((key, index) => {
                if (index === 0) {
                    paramsStr += '?'
                } else {
                    paramsStr += '&'
                }
                paramsStr += `${key}=${JSON.stringify(paramsObj[key])}`
            })
        }
        return paramsStr
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
            const row: any = { id: filterRowId, class: 'filter-row', data: {} }
            this.props.columns.forEach((columnData) => {
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
        const columnList = this.props.columns.map((columnInfo) => {
            columnInfo.renderer = RenderHeaderWarehouseTable
            return columnInfo
        })

        const transformedRows = this.state.transformedTableRows
        const tableDataProps = {
            ...this.props.props,
            searchInfo: this.state.searchInfo,
            sortInfo: this.state.sortInfo,
            setSearchInfo: this.setSearchInfo,
            updateTableData: this.updateTableData,
            toggleSortInfo: this.toggleSortInfo,
            isSortingNeeded: this.props.options?.sorting,
            forceUpdate: () => { this.forceUpdate() }
        }

        const tableData: TableDataType = {
            columns: columnList,
            rows: transformedRows,
            props: tableDataProps,
            defaultCellStyle: this.props.defaultCellStyle,
            style: this.props.style,
            class: this.props.class
        }

        let pagination = <></>
        if (transformedRows.length > 0 && this.props.options?.pagination) {
            pagination = (
                <div className='ship-ant-pagination-div'>
                    <Pagination
                        showSizeChanger
                        onChange={this.handlePaginationParameters}
                        onShowSizeChange={this.handlePaginationParameters}
                        defaultCurrent={this.state.paginationInfo.pageNumber}
                        current={this.state.paginationInfo.pageNumber}
                        pageSize={this.state.paginationInfo.recordsPerPage}
                        total={this.state.paginationInfo.totalRecordsQuantity}
                    />
                </div>
            )
        }

        let testModeToggleDiv = <></>
        if (this.props.options?.testSwitch) {
            testModeToggleDiv = (
                <div className='ship-text-switch-div'>
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
                <div className='ship-loading-spin-div'>
                    <Spin
                        size='large'
                    />
                </div>
            )
        }

        let searchButton = <></>
        if (this.props.options?.search) {
            searchButton = (
                <Button
                    icon={<SearchOutlined />}
                    className='ship-search-btn'
                    onClick={() => {
                        this.toggleSearchActive()
                    }}
                >
                    Поиск
                </Button>
            )
        }

        let mainDivClassName = 'ship-table-div'
        if (this.props.options?.styledTable) {
            mainDivClassName = 'ship-table-div-styled'
        }

        return (
            <div className={mainDivClassName}>
                <div className='ship-first-line'>
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
