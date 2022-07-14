import BaseController from '../BaseController';
import { RequestFriend } from '../../domain/usecase/contact/RequestFriend';
import { CancelRequest } from '../../domain/usecase/contact/CancelRequest';
import { AcceptFriend } from '../../domain/usecase/contact/AcceptFriend';
import { RejectFriend } from '../../domain/usecase/contact/RejectFriend';
import { FindUsers } from '../../domain/usecase/contact/FindUsers';
import { updateFriendStatus } from '../../presentation/Chat/reducer';
import { setSearchContactsResult, updateSearchUsersResult } from '../../presentation/App/reducer';
import { UserData } from '../../domain/model/UserData';
import { GetFriends } from '../../domain/usecase/contact/GetFriends';
import {
    appendFriend,
    removeFriendRequest,
    removeSuggestedContact,
    setFriendRequests,
    setFriends,
    setSuggestedContacts,
    toggleChatbox,
    toggleFriendRequest,
} from '../../presentation/Contact/reducer';
import { GetInvitations } from '../../domain/usecase/contact/GetInvitations';
import { GetSuggestContacts } from '../../domain/usecase/contact/GetSuggestContacts';

class ContactController extends BaseController {
    private requestFriendUseCase;
    private cancelRequestUseCase;
    private acceptFriendUseCase;
    private rejectFriendUseCase;
    private findContactsUseCase;
    private getFriendsUseCase;
    private getFriendInvitationsUseCase;
    private getSuggestContactsUseCase;

    constructor() {
        super();
        this.requestFriendUseCase = new RequestFriend();
        this.cancelRequestUseCase = new CancelRequest();
        this.acceptFriendUseCase = new AcceptFriend();
        this.rejectFriendUseCase = new RejectFriend();
        this.findContactsUseCase = new FindUsers();
        this.getFriendsUseCase = new GetFriends();
        this.getFriendInvitationsUseCase = new GetInvitations();
        this.getSuggestContactsUseCase = new GetSuggestContacts();
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

    public acceptFriend = (userId: string, userData?: UserData) => {
        this.dispatch(removeFriendRequest(userId));
        this.acceptFriendUseCase.invoke(userId);
        if (this.getState().chat.selectedConversation?.userId === userId) {
            this.dispatch(updateFriendStatus('friend'));
        }
        if (userData) {
            this.dispatch(
                appendFriend({ _id: '', user: userData, userId, friendSinceTime: new Date() })
            );
        }
    };

    public rejectFriend = (userId: string) => {
        this.dispatch(removeFriendRequest(userId));
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

    public getFriendList = () => {
        this.getFriendsUseCase.invoke().then((friends) => this.dispatch(setFriends(friends)));
    };

    public toggleFriendRequest = (open?: boolean) => {
        this.dispatch(toggleFriendRequest(open));
    };

    public toggleChatbox = (userId?: boolean | string) => {
        this.dispatch(toggleChatbox(userId));
    };

    public getFriendInvitations = () => {
        this.getFriendInvitationsUseCase
            .invoke()
            .then((friendRequests) => this.dispatch(setFriendRequests(friendRequests)));
    };

    public getSuggestContacts = () => {
        this.getSuggestContactsUseCase
            .invoke()
            .then((suggestedContacts) => this.dispatch(setSuggestedContacts(suggestedContacts)));
    };

    public removeSuggestedContact = (contact: UserData) => {
        this.dispatch(removeSuggestedContact(contact));
    };
}

export default ContactController;
