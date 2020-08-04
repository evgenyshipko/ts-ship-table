import React, { Component } from 'react'
import { Switch } from 'antd'

interface TextSwitchProps {
    text: string,
    isDefaultChecked: boolean,
    onChange: () => void
}

class TextSwitch extends Component<TextSwitchProps> {
    render() {
        return (
            <div>
                {this.props.text}
                <Switch
                    className='ship-text-switch'
                    onChange={() => {
                        this.props.onChange()
                    }}
                    defaultChecked={this.props.isDefaultChecked}
                />
            </div>
        )
    }
}

export default TextSwitch
