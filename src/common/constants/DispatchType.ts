enum AppDispatch {
    'userData' = 'SET_APP_USER_DATA',
    'isError' = 'SET_APP_ERROR',
    'errorMsg' = 'SET_APP_ERROR_MSG',
}

enum ChatDispatch {
    'selectedChatItem' = 'SET_CHAT_SELECTED_ITEM',
}

enum ContactDispatch {
    'friendInvitations' = 'SET_CONTACT_INVITATIONS',
    'contacts' = 'SET_CONTACT_LIST_CONTACTS',
}

const DispatchType = {
    app: AppDispatch,
    chat: ChatDispatch,
    contact: ContactDispatch,
};

export default DispatchType;
