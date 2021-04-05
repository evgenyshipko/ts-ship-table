import React, { Component, FC } from 'react';
import { Switch } from 'antd';

interface TextSwitchProps {
    enabled: boolean;
    text: string;
    isDefaultChecked: boolean;
    onChange: () => void;
}

export const TextSwitch: FC<TextSwitchProps> = (props) => {
    return (
        <div>
            {this.props.text}
            <Switch
                className="ship-text-switch"
                onChange={() => {
                    this.props.onChange();
                }}
                defaultChecked={this.props.isDefaultChecked}
            />
        </div>
    );
};
