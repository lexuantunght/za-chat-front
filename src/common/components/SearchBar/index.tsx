import React from 'react';
import _debounce from 'lodash-es/debounce';
import { IoSearch, IoClose } from 'react-icons/io5';
import Button from '../Button';

type SearchBarProps = {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset?: () => void;
    onSearch?: (value: string) => void;
    name?: string;
    id?: string;
    value?: string;
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    onEndEditing?: (value: string) => void;
    containerStyle?: React.CSSProperties;
    numberOnly?: boolean;
    autoFocus?: boolean;
};

type SearchBarStates = {
    isTyping: boolean;
    value: string;
};

class SearchBar extends React.Component<SearchBarProps, SearchBarStates> {
    constructor(props: SearchBarProps) {
        super(props);
        this.state = {
            isTyping: false,
            value: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[0-9\b]+$/;
        if (!this.props.numberOnly || e.target.value === '' || regex.test(e.target.value)) {
            this.props.onChange?.(e);
            this.setState({ isTyping: true, value: e.target.value }, () => {
                this.handleTyping();
            });
        }
    };

    handleTyping = _debounce(() => {
        if (this.state.isTyping) {
            this.props.onEndEditing?.(this.state.value);
        }
        this.setState({ isTyping: false });
    }, 1000);

    handleCancel = () => {
        this.setState({
            isTyping: false,
            value: '',
        });
        this.props.onReset?.();
    };

    render() {
        const { onSearch, name, id, placeholder, onBlur, onFocus, autoFocus } = this.props;
        return (
            <div className="za-searchbar-container" style={this.props.containerStyle}>
                <Button variant="text" type="button" onClick={() => onSearch?.(this.state.value)}>
                    <IoSearch size={20} />
                </Button>
                <input
                    className="za-searchbar-text"
                    type="text"
                    name={name}
                    value={this.state.value}
                    id={id}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoFocus={autoFocus}
                />
                {this.state.value !== '' && (
                    <Button variant="text" type="button" onClick={this.handleCancel}>
                        <IoClose size={20} />
                    </Button>
                )}
            </div>
        );
    }
}

export default SearchBar;
