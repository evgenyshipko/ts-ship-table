import React, { FC } from 'react';
import { Switch } from 'antd';

interface TextSwitchProps {
    enabled?: boolean;
    isDefaultChecked: boolean;
    onChange: () => void;
}

export const TestSwitch: FC<TextSwitchProps> = (props) => {
    if (props.enabled) {
        return (
            <div className="ship-text-switch-div">
                {'Тест'}
                <Switch
                    className="ship-text-switch"
                    onChange={() => {
                        props.onChange();
                    }}
                    defaultChecked={props.isDefaultChecked}
                />
            </div>
        );
    }
    return <></>;
};
