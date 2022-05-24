import _get from 'lodash-es/get';
import DispatchType from '../constants/DispatchType';

const createDispatch = (path: string, data: any) => ({
    type: _get(DispatchType, path),
    data
});

export default createDispatch;
