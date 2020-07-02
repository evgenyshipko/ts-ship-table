import React, { Component, RefObject } from 'react'

import {
    ShipTable,
    ColumnItemType
} from 'ts-ship-table'

import 'ts-ship-table/dist/index.css'
import { v4 as uuidv4 } from 'uuid'
import { TransformedResponseData } from '../../src/types/PublicTypes'

interface State {
  shipTablePropId: string
  isPaginationNeeded: boolean
}

class App extends Component {
  state: State = {
      shipTablePropId: uuidv4(),
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

    completedColumnRender = (props: any) => {
        if (props.rowData.completed.value) {
            return 'Да'
        } else {
            return 'Нет'
        }
    }

    transformResponseData = (responseData: Array<any>) => {
        const rows = responseData.map((row) => {
            const result: any = { id: uuidv4() }
            this.columnInfoList.forEach((columnData) => {
                const columnName = columnData.field
                result[columnName] = { value: row[columnName] }

                if (columnName === 'completed') {
                    result[columnName] = { ...result[columnName], render: this.completedColumnRender }
                }
            })
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
                    id={this.state.shipTablePropId}
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
