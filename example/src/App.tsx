import React, { Component, ComponentType, RefObject } from 'react'

import {
    ShipTable,
    ColumnType,
    RowType
} from 'ts-ship-table'

import 'ts-ship-table/dist/index.css'
import { v4 as uuidv4 } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import CompletedColumnRender from './renderers/CompletedColumnRender'
import { RendererProps, ResponseTableData } from '../../src'

interface State {
    isPaginationNeeded: boolean,
    tableData: ResponseTableData,
    addedRows: Array<RowType>
}

interface ResponseDataType {
    userId: number,
    title: string,
    completed: boolean
}

class App extends Component {
  state: State = {
      isPaginationNeeded: true,
      tableData: { totalRowQuantity: 0, rows: [] },
      addedRows: []
  }

   endPointPath = 'https://jsonplaceholder.typicode.com/todos'

    myRender: ComponentType<RendererProps> = (props: RendererProps) => {
        return <div>privet {props.rowData.class}</div>
    }

    columnInfoList: Array<ColumnType> = [
        {
            field: 'userId',
            title: 'id юзера',
            filterRendererType: 'number',
            class: 'userid-column-class'
        },
        {
            field: 'title',
            title: 'Название',
            customFilterRenderer: this.myRender,
            class: 'summary-column-class'
        },
        {
            field: 'completed',
            title: 'Выполнено?',
            filterRendererType: 'date',
            class: 'reporter-column-class',
            sortEnable: false
        }
    ]

    componentDidMount() {
        this.updateTableData({})
    }

    addRow = () => {
        const row: RowType = {
            id: uuidv4(),
            data: {
                userId: { value: 'userId' },
                title: { value: 'hello' },
                completed: { value: 'no', renderer: CompletedColumnRender }
            }
        }
        this.state.addedRows.unshift(row)
        this.updateTableData({})
        this.setState(this.state)
    }

    updateTableData = (requestArgs: { [key: string]: any }) => {
        console.log('path by update table data')
        console.log(this.endPointPath + this.getRequestDataParamsString(requestArgs))
        axios.get(this.endPointPath, {}).then(response => {
            this.state.tableData = this.transformResponseData(response)
            this.state.addedRows.forEach((addedRow) => {
                this.state.tableData.rows.unshift(addedRow)
            })
            this.setState(this.state)
        })
    }

    getRequestDataParamsString = (requestArgs: { [key: string]: any }) => {
        let paramsStr: string = ''
        if (requestArgs !== undefined) {
            Object.keys(requestArgs).forEach((key, index) => {
                if (index === 0) {
                    paramsStr += '?'
                } else {
                    paramsStr += '&'
                }
                paramsStr += `${key}=${JSON.stringify(requestArgs[key])}`
            })
        }
        return paramsStr
    }

    transformResponseData = (response: AxiosResponse) => {
        const responseData: Array<ResponseDataType> = response.data
        const rows: Array<RowType> = responseData.map((row) => {
            const data = {
                userId: { value: row.userId },
                title: { value: row.title },
                completed: { value: row.completed, renderer: CompletedColumnRender }
            }
            const result: RowType = {
                id: uuidv4(),
                data: data
            }
            return result
        })

        const result: ResponseTableData = { rows: rows, totalRowQuantity: rows.length }
        return result
    }

    ref: RefObject<any> = React.createRef()

    render() {
        // console.log('App tsx state')
        // console.log(this.state.tableData)

        const addRow = (
            <button
                onClick={() => {
                    this.addRow()
                }}
            >
                addRow
            </button>
        )

        const pbtn = (
            <button
                onClick={() => {
                    this.state.isPaginationNeeded = !this.state.isPaginationNeeded
                    this.setState(this.state)
                }}
            >
                changePagination
            </button>
        )

        return (
            <div>
                {pbtn}
                {/* <ShipTable*/}
                {/*    class='ship-table-prototype'*/}
                {/*    requestConfig={{ dataUrl: this.endPointPath, urlParams: { hi: 1, hello: 10 } }}*/}
                {/*    columns={this.columnInfoList}*/}
                {/*    responseTransformer={this.transformResponseData}*/}
                {/*    options={{ pagination: this.state.isPaginationNeeded, search: true, styledTable: true }}*/}
                {/*    ref={this.ref}*/}
                {/* />*/}
                {addRow}
                <ShipTable
                    id={uuidv4()}
                    class='ship-table-prototype-1'
                    columns={this.columnInfoList}
                    updateTableData={this.updateTableData}
                    tableData={this.state.tableData}
                    options={{ pagination: this.state.isPaginationNeeded, search: true, styledTable: true, sorting: true }}
                    ref={this.ref}
                />
            </div>
        )
    }
}

export default App
