import React, { Component } from 'react';
import { RendererProps } from 'react-bs-table';
import { ColumnType, TableDataProps } from '..';

class CustomFilterCellRenderer extends Component<RendererProps> {
    render() {
        const columnData = this.props.tableData.columns.find(
            (columnData) => columnData.field === this.props.columnId
        ) as ColumnType;
        if (columnData && columnData.customFilterOptions?.renderer) {
            return columnData.customFilterOptions.renderer(
                this.props,
                this.props.tableData.props as TableDataProps
            );
        }
        return <></>;
    }
}

export default CustomFilterCellRenderer;
