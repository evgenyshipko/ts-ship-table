import { ColumnValueType, SearchMode, SortMode } from '..';

class C {
    static DATE_FORMAT = 'YYYY-MM-DD';
    static FILTER_ROW_ID = 'filter';
}
export default C;

export const SEARCH_TYPE: Record<string, SearchMode> = {
    FRONT: 'front',
    BACK: 'back',
};

export const SORT_TYPE: Record<string, SortMode> = {
    FRONT: 'front',
    BACK: 'back',
};

export const COLUMN_TYPE: Record<string, ColumnValueType> = {
    DATE: 'date',
    NUMBER: 'number',
    TEXT: 'text',
};
