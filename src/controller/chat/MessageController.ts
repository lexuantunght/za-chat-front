import BaseController from '../BaseController';
import { Message } from '../../domain/model/Message';
import { SendMessage } from '../../domain/usecase/message/SendMessage';
import { GetMessages } from '../../domain/usecase/message/GetMessages';
import {
    setMessages,
    updateNewMessageToConversation,
    updateStatusMessage,
} from '../../presentation/Chat/reducer';

class MessageController extends BaseController {
    private sendMessageUseCase;
    private getMessagesUseCase;

    constructor() {
        super();
        this.sendMessageUseCase = new SendMessage();
        this.getMessagesUseCase = new GetMessages();
    }

    public sendMessage = (message: Message) => {
        this.dispatch(setMessages([message, ...this.getState().chat.messages]));
        this.dispatch(updateNewMessageToConversation(message));
        this.sendMessageUseCase.invoke(message).catch(this.handleError);
    };

    public getMessages = (conversationId: string) => {
        this.getMessagesUseCase
            .invoke(conversationId)
            .then((messages) => this.dispatch(setMessages(messages)));
    };

    public appendMessage = (message: Message) => {
        if (message.conversationId === this.getState().chat.selectedConversation?._id) {
            this.dispatch(setMessages([message, ...this.getState().chat.messages]));
        }
    };

    public updateStatusMessage = (message: Message) => {
        if (message.conversationId === this.getState().chat.selectedConversation?._id) {
            this.dispatch(updateStatusMessage(message));
        }
    };

    public messagesSelector = this.createSelector((state) => state.chat.messages);
}

export default MessageController;
