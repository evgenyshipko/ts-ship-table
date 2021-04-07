import React, { Component } from 'react';

import {
    RowType,
    SEARCH_TYPE,
    ShipTable,
    SORT_TYPE,
    PAGINATION_TYPE,
} from 'ts-ship-table';

import 'ts-ship-table/dist/index.css';
import { v4 as uuidv4 } from 'uuid';
import CompletedColumnRender from './renderers/CompletedColumnRender';
import { ResponseTableData } from '../../src';
import { Button } from 'antd';
import { columnInfoList } from './columns';
import { getTestRows } from './rows';

interface State {
    isPaginationNeeded: boolean;
    tableData: ResponseTableData;
}

class App extends Component {
    state: State = {
        isPaginationNeeded: true,
        tableData: { totalRowQuantity: 0, rows: [] },
    };

    componentDidMount() {
        this.initTableData();
    }

    initTableData = () => {
        const rows = getTestRows();
        this.setState({
            ...this.state,
            tableData: {
                rows: rows,
                totalRowQuantity: rows.length,
            },
        });
    };

    addRow = () => {
        const row: RowType = {
            id: uuidv4(),
            data: {
                quantity: { value: 6 },
                title: { value: 'apple' },
                completed: { value: false, renderer: CompletedColumnRender },
            },
        };
        this.setState({
            ...this.state,
            tableData: {
                ...this.state.tableData,
                totalRowQuantity: this.state.tableData.totalRowQuantity + 1,
                rows: [row, ...this.state.tableData.rows],
            },
        });
    };

    togglePagination = () => {
        this.setState({
            ...this.state,
            isPaginationNeeded: !this.state.isPaginationNeeded,
        });
    };

    render() {
        const addRowBtn = (
            <Button key="add-row" onClick={this.addRow}>
                Add row
            </Button>
        );

        const togglePaginationBtn = (
            <Button key="change-pgnation-btn" onClick={this.togglePagination}>
                Toggle pagination
            </Button>
        );

        return (
            <div>
                <span>
                    1. Table with pagination, filtering and sort on frontend.
                </span>
                <ShipTable
                    id={uuidv4()}
                    class="ship-table-prototype-1"
                    columns={columnInfoList}
                    tableData={this.state.tableData}
                    updateTableData={() => this.setState(this.state)}
                    jsxElementsToHeader={[togglePaginationBtn, addRowBtn]}
                    options={{
                        pagination: this.state.isPaginationNeeded,
                        paginationType: PAGINATION_TYPE.FRONT,
                        search: true,
                        searchType: SEARCH_TYPE.FRONT,
                        styledTable: true,
                        sorting: true,
                        sortingType: SORT_TYPE.FRONT,
                    }}
                />
            </div>
        );
    }
}

export default App;
