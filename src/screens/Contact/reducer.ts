import { AnyAction } from 'redux';
import DispatchType from '../../common/constants/DispatchType';
import { Contact } from './models';

type ContactState = {
    friendInvitations: Contact[];
    contacts: Contact[];
};

const defaultState: ContactState = {
    friendInvitations: [],
    contacts: [],
};

const contactReducer = (state = defaultState, action: AnyAction) => {
    switch (action.type) {
        case DispatchType.contact.contacts:
            return { ...state, contacts: action.data };
        case DispatchType.contact.friendInvitations:
            return { ...state, friendInvitations: action.data };
        default:
            return state;
    }
};
export default contactReducer;
