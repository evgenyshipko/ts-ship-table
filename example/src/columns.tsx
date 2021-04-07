import React from 'react';
import { ColumnType, TableDataProps, COLUMN_TYPE } from 'ts-ship-table';
import { RendererProps } from 'react-bs-table';
import { Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

const completedCustomFilterRenderer = (
    rendererProps: RendererProps,
    tableDataProps: TableDataProps
) => {
    return (
        <Select
            className="completed-filter-renderer-select"
            onSelect={(value) => {
                const dataValue = value === 'true';
                tableDataProps.setSearchInfo(rendererProps.columnId, dataValue);
                tableDataProps.updateTableData();
            }}
        >
            <Option key={uuidv4()} value="true">
                Да
            </Option>
            <Option key={uuidv4()} value="false">
                Нет
            </Option>
        </Select>
    );
};

const filterFunc = (value: boolean, filterValue: boolean) => {
    return value === filterValue;
};

export const columnInfoList: Array<ColumnType> = [
    {
        field: 'quantity',
        title: 'Кол-во',
        columnValueType: COLUMN_TYPE.NUMBER,
        class: 'quantity-column-class',
        grouped: true,
        sortEnable: true,
    },
    {
        field: 'title',
        title: 'Название',
        class: 'summary-column-class',
        columnValueType: COLUMN_TYPE.TEXT,
        sortEnable: true,
    },
    {
        field: 'completed',
        title: 'Выполнено?',
        columnValueType: COLUMN_TYPE.CUSTOM,
        customFilterOptions: {
            renderer: completedCustomFilterRenderer,
            filterFunc: filterFunc,
        },
        class: 'reporter-column-class',
        sortEnable: true,
    },
    {
        field: 'date',
        title: 'Дата',
        columnValueType: COLUMN_TYPE.DATE,
        class: 'date-column-class',
        sortEnable: true,
    },
];
