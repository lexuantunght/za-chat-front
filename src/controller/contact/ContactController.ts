import BaseController from '../BaseController';
import { RequestFriend } from '../../domain/usecase/contact/RequestFriend';
import { CancelRequest } from '../../domain/usecase/contact/CancelRequest';
import { AcceptFriend } from '../../domain/usecase/contact/AcceptFriend';
import { RejectFriend } from '../../domain/usecase/contact/RejectFriend';
import { FindUsers } from '../../domain/usecase/contact/FindUsers';
import { updateFriendStatus } from '../../presentation/Chat/reducer';
import { setSearchContactsResult, updateSearchUsersResult } from '../../presentation/App/reducer';
import { UserData } from '../../domain/model/UserData';

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
        this.findContactsUseCase = new FindUsers();
    }

    public requestFriend = (userId: string) => {
        if (this.getState().chat.selectedConversation?.userId === userId) {
            this.dispatch(updateFriendStatus('requested'));
        }
        this.requestFriendUseCase.invoke(userId);
    };

    public cancelRequest = (userId: string) => {
        this.cancelRequestUseCase.invoke(userId);
        if (this.getState().chat.selectedConversation?.userId === userId) {
            this.dispatch(updateFriendStatus('stranger'));
        }
    };

    public acceptFriend = (userId: string) => {
        this.acceptFriendUseCase.invoke(userId);
        if (this.getState().chat.selectedConversation?.userId === userId) {
            this.dispatch(updateFriendStatus('friend'));
        }
    };

    public rejectFriend = (userId: string) => {
        this.rejectFriendUseCase.invoke(userId);
    };

    public findUsers = (keyword: string) => {
        if (keyword !== '') {
            this.findContactsUseCase
                .invoke(keyword)
                .then((users) => this.dispatch(setSearchContactsResult(users)));
        }
    };

    public updateSearchUser = (user: UserData) => {
        this.dispatch(updateSearchUsersResult(user));
    };
}

export default ContactController;
