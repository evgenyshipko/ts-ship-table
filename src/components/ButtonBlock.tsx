import React, { FC } from 'react';
import { TestSwitch } from './TestSwitch';
import { Button, Spin } from 'antd';
import { PaginationWrapper } from './PaginationWrapper';
import { TableOptions } from '..';
import { PaginationInfoType, SearchInfoType } from '../types/PrivateTypes';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

type ButtonBlockProps = {
    options?: TableOptions;
    searchInfo: SearchInfoType;
    paginationInfo: PaginationInfoType;
    changePagination: (current: number, pageSize: number | undefined) => void;
    changeTestMode: () => void;
    toggleSearchActive: () => void;
    undoSearch: () => void;
    isDataLoadingSpinActive: boolean;
    isTestModeActive: boolean;
    jsxElementsToHeader: JSX.Element[] | undefined;
};

export const ButtonBlock: FC<ButtonBlockProps> = (props) => (
    <div className="ship-first-line">
        {props.jsxElementsToHeader}
        <TestSwitch
            enabled={props.options?.testSwitch}
            onChange={props.changeTestMode}
            isDefaultChecked={props.isTestModeActive}
        />
        <Button
            hidden={!props.options?.search}
            key="ship-search-btn"
            icon={<SearchOutlined />}
            className="ship-search-btn"
            onClick={props.toggleSearchActive}
        >
            Поиск
        </Button>
        <Button
            hidden={Object.keys(props.searchInfo).length === 0}
            icon={<CloseOutlined />}
            className="ship-deny-search"
            onClick={props.undoSearch}
        >
            Сбросить поиск
        </Button>
        <Spin size="large" spinning={props.isDataLoadingSpinActive} />
        <PaginationWrapper
            enabled={props.options?.pagination}
            onChange={props.changePagination}
            paginationInfo={props.paginationInfo}
        />
    </div>
);
