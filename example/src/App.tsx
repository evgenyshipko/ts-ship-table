import React, { Component } from 'react'

import {
    ShipTable,
    ColumnItemType,
    AxiosConfigType,
    TransformedColumnDataType,
    TableDataType,
    TableProps
} from 'ts-ship-table'

import 'ts-ship-table/dist/index.css'
import { v4 as uuidv4 } from 'uuid'

class App extends Component {
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

    axiosConfig: AxiosConfigType = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // @ts-ignore
    completedColumnRender = (tableData: TableDataType, rowData: TransformedColumnDataType, columnId: string) => {
        if (rowData.completed.value) {
            return 'Да'
        } else {
            return 'Нет'
        }
    }

    transformResponseData = (responseData: Array<any>) => {
        return responseData.map((row) => {
            const result: any = { id: uuidv4() }
            this.columnInfoList.forEach((columnData) => {
                const columnName = columnData.field
                result[columnName] = { value: row[columnName] }

                if (columnName === 'completed') {
                    result[columnName] = { ...result[columnName], funcRenderer: this.completedColumnRender }
                }
            })
            return result
        })
    }

    params: TableProps = {
        id: uuidv4(),
        dataEndPointPath: this.endPointPath,
        axiosConfig: this.axiosConfig,
        columnList: this.columnInfoList,
        transformResponseDataFunc: this.transformResponseData,
        isTestSwitchNeeded: true,
        isSearchNeeded: true,
        isPaginationNeeded: true
    }

    render() {
        return (
            <ShipTable {...this.params} />
        )
    }
}

export default App
