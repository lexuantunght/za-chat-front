import BaseController from '../BaseController';
import { GetConversations } from '../../domain/usecase/conversation/GetConversations';
import { Conversation } from '../../domain/model/Conversation';
import {
    selectConversation,
    setConversations,
    setIsEndTopMsgList,
    updateConversation,
} from '../../presentation/Chat/reducer';

class ConversationController extends BaseController {
    private getConversationUseCase;

    constructor() {
        super();
        this.getConversationUseCase = new GetConversations();
    }

    public getConversations = () => {
        this.getConversationUseCase
            .invoke()
            .then(({ data }) => this.dispatch(setConversations(data)))
            .catch(this.handleError);
    };

    public selectConversation = (conversation?: Conversation) => {
        this.dispatch(setIsEndTopMsgList(false));
        this.dispatch(selectConversation(conversation));
    };

    public addConversation = (conversation: Conversation) => {
        this.dispatch(setConversations([conversation, ...this.getState().chat.conversations]));
    };

    public updateConversation = (conversation: Conversation) => {
        this.dispatch(updateConversation(conversation));
    };
}

export default ConversationController;
