import React, { Component } from 'react'
import { RowType, Table, TableDataType } from 'react-bs-table'
import { Button, Pagination, Spin } from 'antd'
import { CloseOutlined, SearchOutlined } from '@ant-design/icons'
import TextSwitch from './TextSwitch'
import 'antd/dist/antd.css'
import '../styles/table.css'
import '../styles/other.css'
import RenderHeaderWarehouseTable from '../renderers/RenderHeaderWarehouseTable'
import RenderTextFilterCell from '../renderers/RenderTextFilterCell'
import RenderDateFilterCell from '../renderers/RenderDateFilterCell'

import { PaginationInfoType, SearchInfoType, SortInfoType } from '../types/PrivateTypes'

import { ColumnValueType, TableProps } from '../types/PublicTypes'
import RenderNumberFilterCell from '../renderers/RenderNumberFilterCell'
import moment from 'moment'
import C from '../constants/C'

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
            ShipTable.consoleLog(props, '=== getDerivedStateFromProps ===')
            const paginationInfo = ShipTable.getValidPaginationInfo(props, state.paginationInfo)
            let tableDataRows = ShipTable.updateTableDataByFilterRow(props, state, props.tableData.rows)
            if (props.options?.search && props.options?.searchType === 'front' && state.searchInfo) {
                tableDataRows = ShipTable.filterTableRows(props, state, tableDataRows)
            }
            if (props.options?.sorting && props.options.sortingType === 'front' && state.sortInfo) {
                tableDataRows = ShipTable.sortTableRows(props, state, tableDataRows)
            }
            return {
                ...state,
                prevPropsId: props.id,
                tableDataRows: tableDataRows,
                paginationInfo: { ...paginationInfo, totalRecordsQuantity: props.tableData.totalRowQuantity }
            }
        }
        return {}
    }

    consoleLog(...args: any) {
        if (this.props.options?.showLogs) {
            console.log(...args)
        }
    }

    static consoleLog(props: TableProps, ...args: any) {
        if (props.options?.showLogs) {
            console.log(...args)
        }
    }

    componentDidUpdate(prevProps: TableProps) {
        if (
            prevProps.tableData.rows.length > 0 &&
            prevProps.tableData.totalRowQuantity > 0 &&
            this.props.tableData.rows.length === 0 &&
            this.props.tableData.totalRowQuantity > 0
        ) {
            this.consoleLog('=== componentDidUpdate ===')
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
        this.consoleLog('=== updateTableData ===')
        const requestDataParams = this.getRequestDataParams()
        this.props.updateTableData(requestDataParams)
    }

    getRequestDataParams = () => {
        const params: any = { testMode: this.state.isTestModeActive }
        if (this.props.options?.pagination) {
            params.recordsPerPage = this.state.paginationInfo.recordsPerPage
            params.pageNumber = this.state.paginationInfo.pageNumber
        }
        if (Object.keys(this.state.searchInfo).length > 0 && this.props.options?.searchType !== 'front') {
            params.searchInfo = this.state.searchInfo
        }
        if (this.state.sortInfo.columnId !== undefined && this.props.options?.sortingType !== 'front') {
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

    static updateTableDataByFilterRow = (props: TableProps, state: State, dataToTransform: Array<RowType>) => {
        ShipTable.consoleLog(props, '=== updateTableDataByFilterRow ===')
        const filterRowIndex = dataToTransform.findIndex((warehouseRowData) => {
            return warehouseRowData.id === C.FILTER_ROW_ID
        })
        if (state.isSearchActive && filterRowIndex === -1) {
            ShipTable.consoleLog(props, 'addFilterRow')
            const filterRow: any = { id: C.FILTER_ROW_ID, class: 'filter-row', data: {} }
            props.columns.forEach((columnData) => {
                const columnId = columnData.field
                const columnValueType = columnData.columnValueType
                filterRow.data[columnId] = { renderer: ShipTable.getFilterRendererByColumnValueType(columnValueType) }
            })
            dataToTransform.unshift(filterRow)
        } else if (filterRowIndex >= 0) {
            ShipTable.consoleLog(props, 'deleteFilterRow')
            dataToTransform.splice(filterRowIndex, 1)
        }

        return dataToTransform
    }

    private static getFilterRendererByColumnValueType = (columnValueType: ColumnValueType) => {
        switch (columnValueType) {
        case 'date':
            return RenderDateFilterCell
        case 'number':
            return RenderNumberFilterCell
        default:
            return RenderTextFilterCell
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

    private static sortTableRows = (props: TableProps, state: State, tableRows: Array<RowType>) => {
        const sortColumnId = state.sortInfo.columnId
        const asc = state.sortInfo.asc === undefined ? true : state.sortInfo.asc

        ShipTable.consoleLog(props, 'sortColumnId', sortColumnId, 'asc', asc)

        const columnValueType = ShipTable.getColumnValueType(props, sortColumnId)

        if (sortColumnId) {
            tableRows = tableRows.sort((a, b) => {
                const aValue = a.data[sortColumnId]?.value
                const bValue = b.data[sortColumnId]?.value
                if (a.id === C.FILTER_ROW_ID || (aValue !== undefined && bValue === undefined)) {
                    return -1
                } else if (b.id === C.FILTER_ROW_ID || (aValue === undefined && bValue !== undefined)) {
                    return 1
                }
                if (aValue !== undefined && bValue !== undefined) {
                    return ShipTable.sortByValueType(columnValueType, asc, aValue, bValue)
                }
                return 0
            })
        }
        ShipTable.consoleLog(props, 'sortTableRows', tableRows)
        return tableRows
    }

    private static sortByValueType = (columnValueType: ColumnValueType, asc: boolean, a: string, b: string) => {
        switch (columnValueType) {
        case 'text':
            return ShipTable.sortTextValueType(asc, a, b)
        case 'date':
            return ShipTable.sortDateValueType(asc, a, b)
        default:
            return ShipTable.defaultSort(asc, a, b)
        }
    }

    private static sortTextValueType = (asc: boolean, a: string, b: string) => {
        const collator = new Intl.Collator(['en-US', 'ru-RU'], { sensitivity: 'accent' })
        const comparingResult = collator.compare(a, b)
        return asc ? comparingResult : comparingResult * (-1)
    }

    private static sortDateValueType = (asc: boolean, a: string, b: string) => {
        const aMoment = moment(a, C.DATE_FORMAT)
        const bMoment = moment(b, C.DATE_FORMAT)
        return ShipTable.defaultSort(asc, aMoment, bMoment)
    }

    private static defaultSort = (asc: boolean, a: any, b: any) => {
        if (asc) {
            return a > b ? 1 : -1
        } else {
            return a < b ? 1 : -1
        }
    }

    private static filterTableRows = (props: TableProps, state: State, tableRows: Array<RowType>) => {
        const filterColumnIdList = Object.keys(state.searchInfo)
        tableRows = tableRows.filter((row) => {
            if (row.id === C.FILTER_ROW_ID) {
                return true
            }
            let isFilterPassed: boolean = true
            filterColumnIdList.forEach((columnId) => {
                const columnType = ShipTable.getColumnValueType(props, columnId)
                const value = row.data[columnId]?.value
                const filterValue = state.searchInfo[columnId]
                isFilterPassed = isFilterPassed && ShipTable.isValuePassedFilter(columnType, value, filterValue)
            })
            return isFilterPassed
        })
        return tableRows
    }

    private static getColumnValueType = (props: TableProps, columnId: string | undefined) => {
        return props.columns.find((columnData) => {
            return columnData.field === columnId
        })?.columnValueType
    }

    private static isValuePassedFilter(columnValueType: ColumnValueType, value: any, filterValue: any) {
        let result: boolean = false
        if (value !== undefined && filterValue !== undefined) {
            switch (columnValueType) {
            case 'number':
                result = ShipTable.isNumberValuePassedFilter(value, filterValue)
                break
            case 'date':
                result = ShipTable.isDateValuePassedFilter(value, filterValue)
                break
            default:
                result = ShipTable.isTextValuePassedFilter(value, filterValue)
                break
            }
        }
        return result
    }

    private static isNumberValuePassedFilter(value: number, filterValue: {minValue?: number, maxValue?: number}) {
        if (filterValue.minValue && filterValue.maxValue) {
            return value >= filterValue.minValue && value <= filterValue.maxValue
        } else if (filterValue.minValue) {
            return value >= filterValue.minValue
        } else if (filterValue.maxValue) {
            return value <= filterValue.maxValue
        }
        return false
    }

    private static isDateValuePassedFilter(value: string, filterValue: {startDate: string, endDate: string}) {
        const dateValue = moment(value, C.DATE_FORMAT)
        if (filterValue.endDate && filterValue.startDate) {
            return dateValue >= moment(filterValue.startDate) && dateValue <= moment(filterValue.endDate)
        } else if (filterValue.endDate) {
            return dateValue <= moment(filterValue.endDate)
        } else if (filterValue.startDate) {
            return dateValue >= moment(filterValue.startDate)
        }
        return false
    }

    private static isTextValuePassedFilter(value: string, filterValue: string) {
        const textValue = value.toString().toLowerCase()
        return textValue.includes(filterValue.toLowerCase())
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
        this.consoleLog('=== ShipTable render() ===')
        this.consoleLog('this.state', this.state)

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
                    key='ship-search-btn'
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
