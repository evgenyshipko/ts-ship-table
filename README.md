# ts-ship-table

It's one-component library which allows to create Table with search by columns, sorting and pagination.
Based on react-bs-tree-table it allows to render tree tables (see e.g. github:bs50/react-bs-tree-table#master)

## Install

```bash
npm install github:evgenyshipko/ts-ship-table#master
```

## Usage

```tsx
import React, { Component } from 'react'
import { ShipTable, TableProps } from 'ts-ship-table'
import 'ts-ship-table/dist/index.css'

class App extends Component {
    shipTableProps: TableProps = {}
    render() {
        return (
                <ShipTable {...this.shipTableProps}
                />
        )
    }
}

export default App

```
###ShipTable component props

PropName | Description | Required | Type
--- | --- | --- | ---
id | id of current props set| true|  string or number
dataEndPointPath| link to endPoint which returns data in required format| true| string
columnList| list of table columns| true| Array\<ColumnItemType>
transformResponseDataFunc| func which transform endPoint data to user format| false| (arg0: AxiosResponse) => TransformedResponseData
axiosConfig| config for axios.get(dataEndPointPath) function| false| AxiosConfigType
isTestSwitchNeeded| shows test switch| false| boolean
isSearchNeeded| shows search button| false| boolean
isPaginationNeeded| shows pagination | false| boolean
isSortingNeeded| enable sorting function (click table header to view)| false| boolean
ref| ability to ShipTable create ref and use inner ShipTable functions e.g. updateTableData()| false| RefObject\<any>
## License

MIT © [evgenyshipko](https://github.com/evgenyshipko)
