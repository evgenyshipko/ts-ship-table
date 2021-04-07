# ts-ship-table

![alt text](https://github.com/evgenyshipko/ts-ship-table/blob/master/markdown/gif/ts-ship-table-success.gif "Ship table interface")

ShipTable is a wrapped Table component from library [react-bs-table](github:bs50/react-bs-table#master)
with abilities of search by columns, sorting and pagination.

### Install
```bash
npm install github:evgenyshipko/ts-ship-table#master
```
### Usage
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
####ShipTable component props

PropName | Description | Required
--- | --- | ---
id | id of current props set| true
columns| list of table columns| true
options| (see table below) | false
tableData| rows data| true
class| func which transform endPoint data to user format| false
style| common table style| false
jsxElementsToHeader| allows to add elements to line above table| false
ref| ability to ShipTable create ref and use inner ShipTable functions e.g. updateTableData()| false

####TableOptions
PropName | Description
--- | ---
styledTable| set default style to table
testSwitch| shows test switch
search| shows search button
searchType| front or back search mode
pagination| shows pagination
sorting| enable sorting function (click table header to view)
sortingType| front or back sorting mode
showLogs| turn on service logs

## License

MIT © [evgenyshipko](https://github.com/evgenyshipko)
