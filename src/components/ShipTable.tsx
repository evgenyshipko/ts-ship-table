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

import { TableProps } from '../types/PublicTypes'
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
        const index = dataToTransform.findIndex((warehouseRowData) => {
            return warehouseRowData.id === C.filterRowId
        })
        if (state.isSearchActive && index === -1) {
            ShipTable.consoleLog(props, 'addFilterRow')
            const filterRow: any = { id: C.filterRowId, class: 'filter-row', data: {} }
            props.columns.forEach((columnData) => {
                const columnId = columnData.field
                switch (columnData.columnValueType) {
                case 'date':
                    filterRow.data[columnId] = { renderer: RenderDateFilterCell }
                    break
                case 'number':
                    filterRow.data[columnId] = { renderer: RenderNumberFilterCell }
                    break
                default:
                    filterRow.data[columnId] = { renderer: RenderTextFilterCell }
                    break
                }

                if (columnData.customFilterRenderer !== undefined) {
                    filterRow.data[columnId] = { renderer: columnData.customFilterRenderer }
                }
            })
            dataToTransform.unshift(filterRow)
        } else if (index >= 0) {
            ShipTable.consoleLog(props, 'deleteFilterRow')
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

    private static sortTableRows = (props: TableProps, state: State, tableRows: Array<RowType>) => {
        const sortColumnId = state.sortInfo.columnId
        const asc = state.sortInfo.asc

        ShipTable.consoleLog(props, 'sortColumnId', sortColumnId, 'asc', asc)

        const columnValueType = props.columns.find((columnData) => {
            return columnData.field === sortColumnId
        })?.columnValueType

        if (sortColumnId !== undefined && asc !== undefined) {
            tableRows = tableRows.sort((a, b) => {
                if (a.id === C.filterRowId && b.id !== C.filterRowId) {
                    return -1
                } else if (b.id === C.filterRowId && a.id !== C.filterRowId) {
                    return 1
                }
                const aValue = a.data[sortColumnId]?.value
                const bValue = b.data[sortColumnId]?.value
                if (aValue !== undefined && bValue !== undefined) {
                    return ShipTable.sortByValueType(columnValueType, asc, aValue, bValue)
                } else if (aValue !== undefined && bValue === undefined) {
                    return -1
                } else if (aValue === undefined && bValue !== undefined) {
                    return 1
                }
                return 0
            })
        }
        ShipTable.consoleLog(props, 'sortTableRows', tableRows)
        return tableRows
    }

    private static sortByValueType = (columnValueType: 'date' | 'text' | 'number' | undefined, asc: boolean, a: string, b: string) => {
        switch (columnValueType) {
        case 'text':
            return ShipTable.sortText(asc, a, b)
        case 'date':
            return ShipTable.sortDate(asc, a, b)
        default:
            return ShipTable.defaultSort(asc, a, b)
        }
    }

    private static sortText = (asc: boolean, a: string, b: string) => {
        const collator = new Intl.Collator(['en-US', 'ru-RU'], { sensitivity: 'accent' })
        const comparingResult = collator.compare(a, b)
        return asc ? comparingResult : comparingResult * (-1)
    }

    private static sortDate = (asc: boolean, a: string, b: string) => {
        const aMoment = moment(a, C.dateFormat)
        const bMoment = moment(b, C.dateFormat)
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
        const columnFilterTypeMapping = {}
        Object.keys(state.searchInfo).forEach((key) => {
            columnFilterTypeMapping[key] = props.columns.find((columnData) => {
                return columnData.field === key
            })?.columnValueType
        })
        tableRows = tableRows.filter((row) => {
            if (row.id === C.filterRowId) {
                return true
            }
            let isTableRowEnable: boolean = true
            Object.keys(state.searchInfo).forEach((key) => {
                const columnRendererType = columnFilterTypeMapping[key]
                const rowValue = row.data[key]?.value
                const searchValue = state.searchInfo[key]
                isTableRowEnable = isTableRowEnable && ShipTable.isTableColumnEnabled(columnRendererType, rowValue, searchValue)
            })
            return isTableRowEnable
        })
        return tableRows
    }

    private static isTableColumnEnabled(columnRendererType: string, rowValue: any, searchValue: any) {
        let result: boolean = false
        if (rowValue !== undefined && searchValue !== undefined) {
            switch (columnRendererType) {
            case 'number':
                result = ShipTable.isNumberValueEnabled(rowValue, searchValue)
                break
            case 'date':
                result = ShipTable.isDateValueEnabled(rowValue, searchValue)
                break
            default:
                result = ShipTable.isTextValueEnabled(rowValue, searchValue)
                break
            }
        }
        return result
    }

    private static isNumberValueEnabled(rowValue: Number, searchValue: any) {
        if (searchValue.minValue && searchValue.maxValue) {
            return rowValue >= searchValue.minValue && rowValue <= searchValue.maxValue
        } else if (searchValue.minValue) {
            return rowValue >= searchValue.minValue
        } else if (searchValue.maxValue) {
            return rowValue <= searchValue.maxValue
        }
        return false
    }

    private static isDateValueEnabled(rowValue: string, searchValue: any) {
        const dateValue = moment(rowValue, C.dateFormat)
        if (searchValue.endDate && searchValue.startDate) {
            return dateValue >= moment(searchValue.startDate) && dateValue <= moment(searchValue.endDate)
        } else if (searchValue.endDate) {
            return dateValue <= moment(searchValue.endDate)
        } else if (searchValue.startDate) {
            return dateValue >= moment(searchValue.startDate)
        }
        return false
    }

    private static isTextValueEnabled(rowValue: string, searchValue: any) {
        const textValue = rowValue.toString().toLowerCase()
        return textValue.includes(searchValue.toLowerCase())
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
