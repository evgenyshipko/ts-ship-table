import React, { Component } from 'react'
import { Table, RowType, TableDataType } from 'react-bs-table'
import { Button, Pagination, Spin } from 'antd'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
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
    TableProps
} from '../types/PublicTypes'
import RenderNumberFilterCell from '../renderers/RenderNumberFilterCell'

interface State {
    prevPropsId: string,
    tableDataRows: Array<RowType>,
    paginationInfo: PaginationInfoType,
    searchInfo: SearchInfoType,
    sortInfo: SortInfoType,
    isTestModeActive: boolean,
    isSearchActive: boolean,
    isDataLoadingSpinActive: boolean
}

class ShipTable extends Component<TableProps> {
    state: State = {
        prevPropsId: '',
        tableDataRows: [],
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

    static getDerivedStateFromProps(props: TableProps, state: State) {
        if (props.id !== state.prevPropsId) {
            if (props.options?.showLogs) {
                console.log('=== getDerivedStateFromProps ===')
            }
            const paginationInfo = ShipTable.getValidPaginationInfo(props, state.paginationInfo)
            const tableDataRows = ShipTable.updateTableDataByFilterRow(props, state, props.tableData.rows)

            return {
                ...state,
                prevPropsId: props.id,
                tableDataRows: tableDataRows,
                paginationInfo: { ...paginationInfo, totalRecordsQuantity: props.tableData.totalRowQuantity }
            }
        }
        return {}
    }

    componentDidUpdate(prevProps: TableProps) {
        if (
            prevProps.tableData.rows.length > 0 &&
            prevProps.tableData.totalRowQuantity > 0 &&
            this.props.tableData.rows.length === 0 &&
            this.props.tableData.totalRowQuantity > 0
        ) {
            if (this.props.options?.showLogs) {
                console.log('=== componentDidUpdate ===')
            }
            this.updateTableData()
        }
    }

    static getValidPaginationInfo = (props: TableProps, paginationInfo: PaginationInfoType) => {
        if (props.options?.pagination) {
            const totalRecordsQuantity = props.tableData.totalRowQuantity
            const recordsPerPage = paginationInfo.recordsPerPage
            const pageNumber = paginationInfo.pageNumber

            if (
                Math.ceil(totalRecordsQuantity / recordsPerPage) < pageNumber &&
                totalRecordsQuantity !== 0
            ) {
                paginationInfo.pageNumber = 1
            }
        }
        return paginationInfo
    }

    updateTableData = () => {
        if (this.props.options?.showLogs) {
            console.log('=== updateTableData ===')
        }
        const requestDataParams = this.getRequestDataParams()
        this.props.updateTableData(requestDataParams)
    }

    getRequestDataParams = () => {
        const params: any = { testMode: this.state.isTestModeActive }
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
        return params
    }

    handlePaginationParameters = (current: number, pageSize: number | undefined) => {
        this.state.paginationInfo = { ...this.state.paginationInfo, pageNumber: current, recordsPerPage: pageSize! }
        this.setState(this.state)
        this.updateTableData()
    }

    toggleSearchActive = () => {
        this.state.isSearchActive = !this.state.isSearchActive
        this.state.tableDataRows = ShipTable.updateTableDataByFilterRow(this.props, this.state, this.state.tableDataRows)
        this.setState(this.state)
    }

    // toggleDataLoadingSpin = () => {
    //     this.setState({ isDataLoadingSpinActive: !this.state.isDataLoadingSpinActive })
    // }

    static updateTableDataByFilterRow = (props: TableProps, state: State, dataToTransform: Array<RowType>) => {
        const filterRowId: string = 'filter'
        if (props.options?.showLogs) {
            console.log('=== updateTableDataByFilterRow ===')
        }
        const index = dataToTransform.findIndex((warehouseRowData) => {
            return warehouseRowData.id === filterRowId
        })
        if (state.isSearchActive && index === -1) {
            if (props.options?.showLogs) {
                console.log('addFilterRow')
            }

            const filterRow: any = { id: filterRowId, class: 'filter-row', data: {} }
            props.columns.forEach((columnData) => {
                const columnId = columnData.field
                switch (columnData.filterRendererType) {
                case 'text':
                    filterRow.data[columnId] = { renderer: RenderTextFilterCell }
                    break
                case 'date':
                    filterRow.data[columnId] = { renderer: RenderDateFilterCell }
                    break
                case 'number':
                    filterRow.data[columnId] = { renderer: RenderNumberFilterCell }
                    break
                }

                if (columnData.customFilterRenderer !== undefined) {
                    filterRow.data[columnId] = { renderer: columnData.customFilterRenderer }
                }
            })

            dataToTransform.unshift(filterRow)
        } else if (index >= 0) {
            if (props.options?.showLogs) {
                console.log('deleteFilterRow')
            }
            dataToTransform.splice(index, 1)
        }

        return dataToTransform
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

    getTableData = () => {
        const columnList = this.props.columns.map((columnInfo) => {
            if (
                columnInfo.sortEnable === undefined || columnInfo.sortEnable
            ) {
                columnInfo.renderer = RenderHeaderWarehouseTable
            }
            return columnInfo
        })

        const tableDataProps = {
            ...this.props.props,
            searchInfo: this.state.searchInfo,
            sortInfo: this.state.sortInfo,
            setSearchInfo: this.setSearchInfo,
            updateTableData: this.updateTableData,
            toggleSortInfo: this.toggleSortInfo,
            sorting: this.props.options?.sorting,
            forceUpdate: () => { this.forceUpdate() },
            render: () => { this.render() }
        }

        let tableClassName = 'ship-table'
        if (this.props.options?.styledTable) {
            tableClassName = 'ship-table-styled'
        }

        const tableData: TableDataType = {
            columns: columnList,
            rows: this.state.tableDataRows,
            props: tableDataProps,
            defaultCellStyle: this.props.defaultCellStyle,
            style: this.props.style,
            class: this.props.class + ' ' + tableClassName
        }
        return tableData
    }

    handleUndoSearch = () => {
        if (this.state.isSearchActive) {
            this.toggleSearchActive()
        }
        this.state.searchInfo = {}
        this.setState(this.state)
        this.updateTableData()
    }

    render() {
        if (this.props.options?.showLogs) {
            console.log('=== ShipTable render() ===')
            console.log('this.state:')
            console.log(this.state)
        }

        let pagination = <></>
        if (this.props.options?.pagination) {
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

        let undoSearch = <></>
        if (Object.keys(this.state.searchInfo).length > 0) {
            undoSearch = (
                <Button
                    icon={<CloseOutlined />}
                    className='ship-deny-search'
                    onClick={this.handleUndoSearch}
                >
                    Сбросить поиск
                </Button>
            )
        }

        return (
            <div className='ship-table-div'>
                <div className='ship-first-line'>
                    {this.props.jsxElementsToHeader}
                    {testModeToggleDiv}
                    {spin}
                    {searchButton}
                    {undoSearch}
                    {pagination}
                </div>
                <div>
                    <Table tableData={this.getTableData()} />
                </div>
            </div>
        )
    }
}

export { ShipTable }
