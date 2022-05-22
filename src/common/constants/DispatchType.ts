enum AppDispatch {
    'userData' = 'SET_APP_USER_DATA',
    'isError' = 'SET_APP_ERROR',
    'errorMsg' = 'SET_APP_ERROR_MSG'
}

const DispatchType = {
    app: AppDispatch
};

export default DispatchType;
