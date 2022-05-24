enum AppDispatch {
    'userData' = 'SET_APP_USER_DATA',
    'isError' = 'SET_APP_ERROR',
    'errorMsg' = 'SET_APP_ERROR_MSG'
}

enum ChatDispatch {
    'selectedChatItem' = 'SET_CHAT_SELECTED_ITEM'
}

const DispatchType = {
    app: AppDispatch,
    chat: ChatDispatch
};

export default DispatchType;
