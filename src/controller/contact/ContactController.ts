import BaseController from '../BaseController';
import { RequestFriend } from '../../domain/usecase/contact/RequestFriend';
import { CancelRequest } from '../../domain/usecase/contact/CancelRequest';
import { AcceptFriend } from '../../domain/usecase/contact/AcceptFriend';
import { RejectFriend } from '../../domain/usecase/contact/RejectFriend';

class ContactController extends BaseController {
    private requestFriendUseCase;
    private cancelRequestUseCase;
    private acceptFriendUseCase;
    private rejectFriendUseCase;

    constructor() {
        super();
        this.requestFriendUseCase = new RequestFriend();
        this.cancelRequestUseCase = new CancelRequest();
        this.acceptFriendUseCase = new AcceptFriend();
        this.rejectFriendUseCase = new RejectFriend();
    }

    public requestFriend = (userId: string) => {
        this.requestFriendUseCase.invoke(userId);
    };

    public cancelRequest = (userId: string) => {
        this.cancelRequestUseCase.invoke(userId);
    };

    public acceptFriend = (userId: string) => {
        this.acceptFriendUseCase.invoke(userId);
    };

    public rejectFriend = (userId: string) => {
        this.rejectFriendUseCase.invoke(userId);
    };
}

export default ContactController;
