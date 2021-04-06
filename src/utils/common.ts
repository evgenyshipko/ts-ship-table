import { TableProps } from '..';

export const getColumnValueType = (
    props: TableProps,
    columnId: string | undefined
) => {
    return props.columns.find((columnData) => {
        return columnData.field === columnId;
    })?.columnValueType;
};

export const consoleLog = (props: TableProps, ...args: any) => {
    if (props.options?.showLogs) {
        console.log(...args);
    }
};
