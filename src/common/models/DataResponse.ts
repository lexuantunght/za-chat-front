type DataResponse = {
    status: 'success' | 'fail';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    message?: string;
};

export default DataResponse;
