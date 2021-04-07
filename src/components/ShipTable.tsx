import React, { Component } from 'react';
import { RowType, Table, TableDataType } from 'react-bs-table';
import 'antd/dist/antd.css';
import '../styles/table.css';
import '../styles/other.css';
import RenderHeaderWarehouseTable from '../renderers/RenderHeaderWarehouseTable';
import RenderTextFilterCell from '../renderers/RenderTextFilterCell';
import RenderDateFilterCell from '../renderers/RenderDateFilterCell';

import {
    PaginationInfoType,
    SearchInfoType,
    SortInfoType,
} from '../types/PrivateTypes';

import { ColumnType, PAGINATION_TYPE, TableDataProps, TableProps } from '..';
import RenderNumberFilterCell from '../renderers/RenderNumberFilterCell';
import C, { COLUMN_TYPE, SEARCH_TYPE, SORT_TYPE } from '../constants/C';
import { sortTableRows } from '../utils/sort';
import { filterTableRows } from '../utils/filter';
import { consoleLog } from '../utils/common';
import { ButtonBlock } from './ButtonBlock';
import EmptyFilterCellRenderer from '../renderers/RenderEmptyFilterCell';
import CustomFilterCellRenderer from '../renderers/RenderCustomFilterCell';

export interface ShipTableState {
    prevPropsId: string;
    tableDataRows: Array<RowType>;
    paginationInfo: PaginationInfoType;
    searchInfo: SearchInfoType;
    sortInfo: SortInfoType;
    isTestModeActive: boolean;
    isSearchActive: boolean;
    isDataLoadingSpinActive: boolean;
}

class ShipTable extends Component<TableProps> {
    state: ShipTableState = {
        prevPropsId: '',
        tableDataRows: [],
        isSearchActive: false,
        isTestModeActive: false,
        searchInfo: {},
        isDataLoadingSpinActive: false,
        paginationInfo: {
            pageNumber: 1,
            recordsPerPage: 10,
            totalRecordsQuantity: 50,
        },
        sortInfo: {
            columnId: undefined,
            asc: undefined,
        },
    };

    componentDidUpdate(prevProps: TableProps) {
        if (
            prevProps.tableData.rows.length > 0 &&
            prevProps.tableData.totalRowQuantity > 0 &&
            this.props.tableData.rows.length === 0 &&
            this.props.tableData.totalRowQuantity > 0
        ) {
            consoleLog(this.props, '=== componentDidUpdate ===');
            this.updateTableData();
        }
    }

    static getDerivedStateFromProps(props: TableProps, state: ShipTableState) {
        if (props.id !== state.prevPropsId) {
            consoleLog(props, '=== getDerivedStateFromProps ===');
            let tableDataRows = props.tableData.rows;
            if (
                props.options?.search &&
                props.options?.searchType === SEARCH_TYPE.FRONT &&
                state.searchInfo
            ) {
                tableDataRows = filterTableRows(props, state, tableDataRows);
            }
            if (
                props.options?.sorting &&
                props.options.sortingType === SORT_TYPE.FRONT &&
                state.sortInfo
            ) {
                tableDataRows = sortTableRows(props, state, tableDataRows);
            }
            const paginationInfo = ShipTable.getPaginationInfo(
                props,
                state.paginationInfo,
                tableDataRows
            );
            if (props.options?.pagination) {
                const start =
                    (paginationInfo.pageNumber - 1) *
                    paginationInfo.recordsPerPage;
                const end = start + paginationInfo.recordsPerPage;
                tableDataRows = tableDataRows.slice(start, end);
            }
            tableDataRows = ShipTable.updateTableDataByFilterRow(
                props,
                state,
                tableDataRows
            );
            return {
                ...state,
                prevPropsId: props.id,
                tableDataRows: tableDataRows,
                paginationInfo: paginationInfo,
            };
        }
        return {};
    }

    static getPaginationInfo = (
        props: TableProps,
        paginationInfo: PaginationInfoType,
        tableDataRows: RowType[]
    ): PaginationInfoType => {
        let totalRecordsQuantity = props.tableData.totalRowQuantity;
        if (props.options?.pagination) {
            if (props.options.paginationType === PAGINATION_TYPE.FRONT) {
                totalRecordsQuantity = tableDataRows.length;
            }
            const recordsPerPage = paginationInfo.recordsPerPage;
            const pageNumber = paginationInfo.pageNumber;
            if (
                Math.ceil(totalRecordsQuantity / recordsPerPage) < pageNumber &&
                totalRecordsQuantity !== 0
            ) {
                paginationInfo.pageNumber = 1;
            }
        }
        return {
            ...paginationInfo,
            totalRecordsQuantity: totalRecordsQuantity,
        };
    };

    updateTableData = () => {
        if (this.props.updateTableData) {
            consoleLog(this.props, '=== updateTableData ===');
            const requestDataParams = this.getRequestDataParams();
            this.props.updateTableData(requestDataParams);
        }
    };

    getRequestDataParams = () => {
        const params: any = { testMode: this.state.isTestModeActive };
        if (this.props.options?.pagination) {
            params.recordsPerPage = this.state.paginationInfo.recordsPerPage;
            params.pageNumber = this.state.paginationInfo.pageNumber;
        }
        if (
            Object.keys(this.state.searchInfo).length > 0 &&
            this.props.options?.searchType !== SEARCH_TYPE.FRONT
        ) {
            params.searchInfo = this.state.searchInfo;
        }
        if (
            this.state.sortInfo.columnId !== undefined &&
            this.props.options?.sortingType !== SORT_TYPE.FRONT
        ) {
            params.sortData = {
                column: this.state.sortInfo.columnId,
                asc: this.state.sortInfo.asc,
            };
        }
        return params;
    };

    handleChangePagination = (
        current: number,
        pageSize: number | undefined
    ) => {
        this.setState({
            ...this.state,
            paginationInfo: {
                ...this.state.paginationInfo,
                pageNumber: current,
                recordsPerPage: pageSize!,
            },
        });
        this.updateTableData();
    };

    toggleSearchActive = () => {
        this.state.isSearchActive = !this.state.isSearchActive;
        this.setState({
            ...this.state,
            tableDataRows: ShipTable.updateTableDataByFilterRow(
                this.props,
                this.state,
                this.state.tableDataRows
            ),
        });
    };

    static updateTableDataByFilterRow = (
        props: TableProps,
        state: ShipTableState,
        dataToTransform: Array<RowType>
    ) => {
        consoleLog(props, '=== updateTableDataByFilterRow ===');
        const filterRowIndex = dataToTransform.findIndex((warehouseRowData) => {
            return warehouseRowData.id === C.FILTER_ROW_ID;
        });

        if (state.isSearchActive && filterRowIndex === -1) {
            consoleLog(props, 'addFilterRow');
            const filterRow: any = {
                id: C.FILTER_ROW_ID,
                class: 'filter-row',
                data: {},
            };
            props.columns.forEach((columnData) => {
                const columnId = columnData.field;
                const renderer = ShipTable.getFilterRenderer(columnData);
                filterRow.data[columnId] = { renderer };
            });
            dataToTransform.unshift(filterRow);
        } else if (filterRowIndex >= 0) {
            consoleLog(props, 'deleteFilterRow');
            dataToTransform.splice(filterRowIndex, 1);
        }

        return dataToTransform;
    };

    private static getFilterRenderer = (columnData: ColumnType) => {
        const columnValueType = columnData.columnValueType;
        switch (columnValueType) {
            case COLUMN_TYPE.CUSTOM:
                return CustomFilterCellRenderer;
            case COLUMN_TYPE.DATE:
                return RenderDateFilterCell;
            case COLUMN_TYPE.NUMBER:
                return RenderNumberFilterCell;
            case COLUMN_TYPE.TEXT:
                return RenderTextFilterCell;
            default:
                return EmptyFilterCellRenderer;
        }
    };

    toggleSortInfo = (columnId: string) => {
        const sortInfo = this.state.sortInfo;
        if (sortInfo.columnId === columnId) {
            sortInfo.asc = !sortInfo.asc;
        } else {
            sortInfo.columnId = columnId;
            sortInfo.asc = true;
        }
        this.setState(this.state);
    };

    setSearchInfo = (columnId: string, value: any) => {
        if (value !== '') {
            this.state.searchInfo[columnId] = value;
        } else {
            delete this.state.searchInfo[columnId];
        }
        this.setState(this.state);
    };

    handleChangeTestMode = () => {
        this.setState({
            ...this.state,
            isTestModeActive: !this.state.isTestModeActive,
        });
        this.updateTableData();
    };

    getTableData = (): TableDataType => {
        const columnList = this.props.columns.map((columnInfo) => {
            if (columnInfo.sortEnable === undefined || columnInfo.sortEnable) {
                columnInfo.renderer = RenderHeaderWarehouseTable;
            }
            return columnInfo;
        });

        const tableDataProps: TableDataProps = {
            searchInfo: this.state.searchInfo,
            sortInfo: this.state.sortInfo,
            setSearchInfo: this.setSearchInfo,
            updateTableData: this.updateTableData,
            toggleSortInfo: this.toggleSortInfo,
            sorting: this.props.options?.sorting,
            forceUpdate: () => {
                this.forceUpdate();
            },
        };

        const tableClassName = this.props.options?.styledTable
            ? 'ship-table-styled'
            : 'ship-table';

        return {
            columns: columnList,
            rows: this.state.tableDataRows,
            props: { ...this.props.props, ...tableDataProps },
            defaultCellStyle: this.props.defaultCellStyle,
            style: this.props.style,
            class: this.props.class + ' ' + tableClassName,
        };
    };

    handleUndoSearch = () => {
        if (this.state.isSearchActive) {
            this.toggleSearchActive();
        }
        this.setState({
            ...this.state,
            searchInfo: {},
        });
        this.updateTableData();
    };

    render() {
        consoleLog(this.props, '=== ShipTable render() ===');
        consoleLog(this.props, 'ShipTable.state', this.state);
        return (
            <div className="ship-table-div">
                <ButtonBlock
                    options={this.props.options}
                    jsxElementsToHeader={this.props.jsxElementsToHeader}
                    searchInfo={this.state.searchInfo}
                    paginationInfo={this.state.paginationInfo}
                    isDataLoadingSpinActive={this.state.isDataLoadingSpinActive}
                    isTestModeActive={this.state.isTestModeActive}
                    changePagination={this.handleChangePagination}
                    changeTestMode={this.handleChangeTestMode}
                    toggleSearchActive={this.toggleSearchActive}
                    undoSearch={this.handleUndoSearch}
                />
                <Table tableData={this.getTableData()} />
            </div>
        );
    }
}

export { ShipTable };
