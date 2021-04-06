import React, { FC } from 'react';
import { PaginationInfoType } from '../types/PrivateTypes';
import { Pagination } from 'antd';

type PaginationProps = {
    enabled?: boolean;
    paginationInfo: PaginationInfoType;
    onChange: (current: number, pageSize: number | undefined) => void;
};

export const PaginationWrapper: FC<PaginationProps> = (props) => {
    if (props.enabled) {
        return (
            <div className="ship-ant-pagination-div">
                <Pagination
                    showSizeChanger
                    onChange={props.onChange}
                    onShowSizeChange={props.onChange}
                    defaultCurrent={props.paginationInfo.pageNumber}
                    current={props.paginationInfo.pageNumber}
                    pageSize={props.paginationInfo.recordsPerPage}
                    total={props.paginationInfo.totalRecordsQuantity}
                />
            </div>
        );
    }
    return <></>;
};
