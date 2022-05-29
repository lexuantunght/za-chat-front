import _get from 'lodash-es/get';
import DispatchType from '../constants/DispatchType';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createDispatch = (path: string, data: any) => ({
    type: _get(DispatchType, path),
    data,
});

export default createDispatch;
