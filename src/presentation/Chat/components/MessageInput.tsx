import React from 'react';
import _debounce from 'lodash-es/debounce';

interface MessageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onBeginEditing?: () => void;
    onEndEditing?: () => void;
}

type MessageInputStates = {
    isTyping: boolean;
};

class MessageInput extends React.Component<MessageInputProps, MessageInputStates> {
    constructor(props: MessageInputProps) {
        super(props);
        this.state = {
            isTyping: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange?.(e);
        if (!this.state.isTyping) {
            this.props.onBeginEditing?.();
        }
        this.setState({ isTyping: true }, () => {
            this.handleTyping();
        });
    };

    handleTyping = _debounce(() => {
        if (this.state.isTyping) {
            this.props.onEndEditing?.();
        }
        this.setState({ isTyping: false });
    }, 1000);

    render() {
        return (
            <input
                id={this.props.id}
                name={this.props.name}
                className={this.props.className}
                placeholder={this.props.placeholder}
                onBlur={this.props.onBlur}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}

export default MessageInput;
