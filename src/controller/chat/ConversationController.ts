import BaseController from '../BaseController';
import { GetConversations } from '../../domain/usecase/conversation/GetConversations';
import { Conversation } from '../../domain/model/Conversation';
import { selectConversation, setConversations } from '../../presentation/Chat/reducer';

class ConversationController extends BaseController {
    private getConversationUseCase;

    constructor() {
        super();
        this.getConversationUseCase = new GetConversations();
    }

    public getConversations = () => {
        this.getConversationUseCase
            .invoke()
            .then((conversations) => this.dispatch(setConversations(conversations)))
            .catch(this.handleError);
    };

    public selectConversation = (conversation?: Conversation) => {
        this.dispatch(selectConversation(conversation));
    };
}

export default ConversationController;
