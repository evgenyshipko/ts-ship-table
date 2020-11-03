import React, { Component, ComponentType, RefObject } from 'react'

import {
    ShipTable,
    ColumnType,
    RowType
} from 'ts-ship-table'

import 'ts-ship-table/dist/index.css'
import { v4 as uuidv4 } from 'uuid'
import CompletedColumnRender from './renderers/CompletedColumnRender'
import { RendererProps, ResponseTableData } from '../../src'
import { Button } from 'antd'
import DateRenderer from './renderers/DateRenderer'

interface State {
    isPaginationNeeded: boolean,
    tableData1: ResponseTableData,
    tableData2: ResponseTableData,
    addedRows: Array<RowType>
}

class App extends Component {
      state: State = {
          isPaginationNeeded: true,
          tableData1: { totalRowQuantity: 0, rows: [] },
          tableData2: { totalRowQuantity: 0, rows: [] },
          addedRows: []
      }

    myRender: ComponentType<RendererProps> = (props: RendererProps) => {
        return <div>privet {props.rowData.class}</div>
    }

    columnInfoList: Array<ColumnType> = [
        {
            field: 'userId',
            title: 'id юзера',
            columnValueType: 'number',
            class: 'userid-column-class',
            grouped: true,
            sortEnable: true
        },
        {
            field: 'title',
            title: 'Название',
            customFilterRenderer: this.myRender,
            class: 'summary-column-class',
            columnValueType: 'text',
            sortEnable: true
        },
        {
            field: 'completed',
            title: 'Выполнено?',
            class: 'reporter-column-class',
            sortEnable: true
        },
        {
            field: 'date',
            title: 'Дата',
            columnValueType: 'date',
            class: 'date-column-class',
            sortEnable: true
        }
    ]

    componentDidMount() {
        this.updateTableData1()
        this.updateTableData2()
    }

    addRow = () => {
        const row: RowType = {
            id: uuidv4(),
            data: {
                userId: { value: 6 },
                title: { value: 'ящер' },
                completed: { value: false, renderer: CompletedColumnRender }
            }
        }

        this.state.addedRows.unshift(row)
        this.updateTableData1()
        this.setState(this.state)
    }

    updateTableData1 = () => {
        console.log('path by update table data')
        const rows = this.getTestRows()
        this.state.tableData1 = {
            rows: rows,
            totalRowQuantity: rows.length
        }
        this.state.addedRows.forEach((addedRow) => {
            this.state.tableData1.rows.unshift(addedRow)
        })
        this.setState(this.state)
    }

    updateTableData2 = () => {
        const rows = this.getTestRows()
        this.state.tableData2 = {
            rows: rows,
            totalRowQuantity: rows.length
        }
        this.state.addedRows.forEach((addedRow) => {
            this.state.tableData2.rows.unshift(addedRow)
        })
        // add parents
        this.state.tableData2.rows[1].parent = this.state.tableData2.rows[0].id
        this.state.tableData2.rows[2].parent = this.state.tableData2.rows[0].id
        this.setState(this.state)
    }


    getTestRows = () => {
        return ([
            {
                id: uuidv4(),
                data: {
                    userId: { value: 2 },
                    title: { value: 'абрикос' },
                    completed: { value: true, renderer: CompletedColumnRender },
                    date: { value: '2020-11-18T03:24:00', renderer: DateRenderer }
                }
            },
            {
                id: uuidv4(),
                data: {
                    userId: { value: 1 },
                    title: { value: 'авокадо' },
                    completed: { value: false, renderer: CompletedColumnRender },
                    date: { value: '2020-10-17T03:24:00', renderer: DateRenderer }
                }
            },
            {
                id: uuidv4(),
                data: {
                    userId: { value: 3 },
                    title: { value: 'булка' },
                    completed: { value: true, renderer: CompletedColumnRender },
                    date: { value: '1995-12-17T03:24:00', renderer: DateRenderer }
                }
            },
            {
                id: uuidv4(),
                data: {
                    userId: { value: 4 },
                    title: { value: 'aзбука' },
                    completed: { value: false, renderer: CompletedColumnRender },
                    date: { value: '2020-11-17T03:24:00', renderer: DateRenderer }
                }
            }
        ])
    }

    ref: RefObject<any> = React.createRef()

    render() {
        const addRow = (
            <Button
                key='add-row'
                onClick={() => {
                    this.addRow()
                }}
            >
                addRow
            </Button>
        )

        const pbtn = (
            <Button
                key='change-pgnation-btn'
                onClick={() => {
                    this.state.isPaginationNeeded = !this.state.isPaginationNeeded
                    this.setState(this.state)
                }}
            >
                changePagination
            </Button>
        )

        return (
            <div>
                <span>
                    1. Table with ability to add rows, switch pagination, search and sort on frontend.
                </span>
                <ShipTable
                    id={uuidv4()}
                    class='ship-table-prototype-1'
                    columns={this.columnInfoList}
                    updateTableData={this.updateTableData1}
                    tableData={this.state.tableData1}
                    options={
                        {
                            pagination: this.state.isPaginationNeeded,
                            search: true,
                            searchType: 'front',
                            styledTable: true,
                            sorting: true,
                            sortingType: 'front',
                            showLogs: true
                        }
                    }
                    ref={this.ref}
                    jsxElementsToHeader={[pbtn, addRow]}
                />
                <span>
                    2. Table with tree-structure
                </span>
                <ShipTable
                    id={uuidv4()}
                    class='ship-table-prototype-1'
                    columns={this.columnInfoList}
                    updateTableData={this.updateTableData2}
                    tableData={this.state.tableData2}
                    options={
                        {
                            styledTable: true
                        }
                    }
                />
            </div>
        )
    }
}

export default App
