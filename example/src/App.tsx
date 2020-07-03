// @ts-ignore
import React, { Component, RefObject } from 'react'

import {
    ShipTable,
    ColumnItemType,
    TransformedResponseData
} from 'ts-ship-table'

import 'ts-ship-table/dist/index.css'
import { v4 as uuidv4 } from 'uuid'
import { AxiosResponse } from 'axios'
import CompletedColumnRender from './renderers/CompletedColumnRender'
import { RowType } from '../../src'

interface State {
  isPaginationNeeded: boolean
}

interface ResponseDataType {
    userId: number,
    id: number,
    title: string,
    completed: boolean
}

class App extends Component {
  state: State = {
      isPaginationNeeded: true
  }

   endPointPath = 'https://jsonplaceholder.typicode.com/todos'

   columnInfoList: Array<ColumnItemType> = [
       {
           field: 'userId',
           title: 'id юзера',
           filterEnabled: true,
           class: 'userid-column-class'
       },
       {
           field: 'title',
           title: 'Название',
           filterEnabled: true,
           class: 'summary-column-class'
       },
       {
           field: 'completed',
           title: 'Выполнено?',
           filterEnabled: false,
           class: 'reporter-column-class'
       }
   ]

    transformResponseData = (response: AxiosResponse) => {
        const responseData: Array<ResponseDataType> = response.data
        const rows: Array<RowType> = responseData.map((row) => {
            const result: RowType = {
                id: uuidv4(),
                userId: { value: row.userId },
                title: { value: row.title },
                completed: { value: row.completed, render: CompletedColumnRender }
            }
            return result
        })

        const result: TransformedResponseData = { rows: rows, totalRowQuantity: rows.length }
        return result
    }

    ref: RefObject<any> = React.createRef()

    render() {
        const btn = (
            <button
                onClick={() => {
                    this.ref.current.updateTableData()
                }}
            >
                updateShipTable
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
                {btn}
                {pbtn}
                <ShipTable
                    id={uuidv4()}
                    dataEndPointPath={this.endPointPath}
                    columnList={this.columnInfoList}
                    transformResponseDataFunc={this.transformResponseData}
                    isPaginationNeeded={this.state.isPaginationNeeded}
                    ref={this.ref}
                />
            </div>
        )
    }
}

export default App
