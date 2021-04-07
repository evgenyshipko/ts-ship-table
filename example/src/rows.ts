import { v4 as uuidv4 } from 'uuid';
import CompletedColumnRender from './renderers/CompletedColumnRender';
import DateRenderer from './renderers/DateRenderer';

const getRows = () => {
    return [
        {
            id: uuidv4(),
            data: {
                quantity: { value: 2 },
                title: { value: 'orange' },
                completed: { value: true, renderer: CompletedColumnRender },
                date: {
                    value: '2020-11-18T03:24:00',
                    renderer: DateRenderer,
                },
            },
        },
        {
            id: uuidv4(),
            data: {
                quantity: { value: 1 },
                title: { value: 'banana' },
                completed: {
                    value: false,
                    renderer: CompletedColumnRender,
                },
                date: {
                    value: '2020-10-17T03:24:00',
                    renderer: DateRenderer,
                },
            },
        },
        {
            id: uuidv4(),
            data: {
                userId: { value: 3 },
                title: { value: 'berries' },
                completed: { value: true, renderer: CompletedColumnRender },
                date: {
                    value: '1995-12-17T03:24:00',
                    renderer: DateRenderer,
                },
            },
        },
        {
            id: uuidv4(),
            data: {
                quantity: { value: 4 },
                title: { value: 'coconut' },
                completed: {
                    value: false,
                    renderer: CompletedColumnRender,
                },
                date: {
                    value: '2020-11-17T03:24:00',
                    renderer: DateRenderer,
                },
            },
        },
    ];
};

export const getTestRows = () => {
    const rows = [];
    for (let i = 0; i < 5; i++) {
        rows.push(...getRows());
    }
    return rows;
};
