type RestResponse = {
    status: 'success' | 'fail';
    data?: any;
    message?: string;
};

export default RestResponse;