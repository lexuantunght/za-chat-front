import BaseController from '../BaseController';
import { RequestFriend } from '../../domain/usecase/contact/RequestFriend';
import { CancelRequest } from '../../domain/usecase/contact/CancelRequest';
import { AcceptFriend } from '../../domain/usecase/contact/AcceptFriend';
import { RejectFriend } from '../../domain/usecase/contact/RejectFriend';
import { FindContacts } from '../../domain/usecase/contact/FindContacts';
import { updateFriendStatus } from '../../presentation/Chat/reducer';
import { setSearchContactsResult } from '../../presentation/App/reducer';

class ContactController extends BaseController {
    private requestFriendUseCase;
    private cancelRequestUseCase;
    private acceptFriendUseCase;
    private rejectFriendUseCase;
    private findContactsUseCase;

    constructor() {
        super();
        this.requestFriendUseCase = new RequestFriend();
        this.cancelRequestUseCase = new CancelRequest();
        this.acceptFriendUseCase = new AcceptFriend();
        this.rejectFriendUseCase = new RejectFriend();
        this.findContactsUseCase = new FindContacts();
    }

    public requestFriend = (userId: string) => {
        this.dispatch(updateFriendStatus('requested'));
        this.requestFriendUseCase.invoke(userId);
    };

    public cancelRequest = (userId: string) => {
        this.cancelRequestUseCase.invoke(userId);
        this.dispatch(updateFriendStatus());
    };

    public acceptFriend = (userId: string) => {
        this.acceptFriendUseCase.invoke(userId);
        this.dispatch(updateFriendStatus('friend'));
    };

    public rejectFriend = (userId: string) => {
        this.rejectFriendUseCase.invoke(userId);
    };

    public findContacts = (keyword: string) => {
        if (keyword !== '') {
            this.findContactsUseCase
                .invoke(keyword)
                .then((contacts) => this.dispatch(setSearchContactsResult(contacts)));
        }
    };
}

export default ContactController;
