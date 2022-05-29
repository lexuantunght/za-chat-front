import { AnyAction } from 'redux';
import DispatchType from '../../common/constants/DispatchType';
import { ChatItem } from './models';

type ChatState = {
    selectedChatItem?: ChatItem;
};

const defaultState: ChatState = {
    selectedChatItem: undefined,
};

const chatReducer = (state = defaultState, action: AnyAction) => {
    switch (action.type) {
        case DispatchType.chat.selectedChatItem:
            return { ...state, selectedChatItem: action.data };
        default:
            return state;
    }
};
export default chatReducer;
