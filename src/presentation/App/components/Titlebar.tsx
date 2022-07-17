import React from 'react';
import { BiMinus, BiWindows, BiWindow } from 'react-icons/bi';
import { IoCloseSharp } from 'react-icons/io5';

type TitlebarProps = {
    title?: string;
    visible?: boolean;
};

const Titlebar = ({ title, visible = true }: TitlebarProps) => {
    return (
        <div className="app-title-bar" hidden={!visible}>
            <span className="app-name-bar">{title}</span>
            <div className="app-title-bar-controls">
                <div className="window-button" id="window-button-min">
                    <BiMinus size={20} />
                </div>
                <div className="window-button" id="window-button-restore">
                    <BiWindows size={16} />
                </div>
                <div className="window-button" id="window-button-max">
                    <BiWindow size={16} />
                </div>
                <div className="window-button" id="window-button-close">
                    <IoCloseSharp size={20} />
                </div>
            </div>
        </div>
    );
};

export default Titlebar;
