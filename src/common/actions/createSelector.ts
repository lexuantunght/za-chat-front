import _get from 'lodash-es/get';
import { RootState } from '../../utils/redux/store';

const createSelector = (path: string) => (state: RootState) => _get(state, path);

export default createSelector;
