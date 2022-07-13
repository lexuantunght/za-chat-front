import React from 'react';
import _debounce from 'lodash-es/debounce';
import TextareaAutosize from 'react-textarea-autosize';

interface MessageInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    onBeginEditing?: () => void;
    onEndEditing?: () => void;
    handleSubmit?: () => void;
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

    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onChange?.(e);
        if (!this.state.isTyping) {
            this.props.onBeginEditing?.();
        }
        this.setState({ isTyping: true }, () => {
            this.handleTyping();
        });
    };

    onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey == false) {
            e.preventDefault();
            this.props.handleSubmit?.();
        }
    };

    handleTyping = _debounce(() => {
        if (this.state.isTyping) {
            this.props.onEndEditing?.();
        }
        this.setState({ isTyping: false });
    }, 1000);

    render() {
        return (
            <TextareaAutosize
                id={this.props.id}
                name={this.props.name}
                className={this.props.className}
                placeholder={this.props.placeholder}
                onBlur={this.props.onBlur}
                value={this.props.value}
                onChange={this.handleChange}
                onKeyDown={this.onEnterPress}
                onPaste={this.props.onPaste}
                minRows={1}
                maxRows={5}
            />
        );
    }
}

export default MessageInput;
