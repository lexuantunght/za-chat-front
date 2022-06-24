import BaseController from '../BaseController';
import { Message } from '../../domain/model/Message';
import { SendMessage } from '../../domain/usecase/message/SendMessage';
import { GetMessages } from '../../domain/usecase/message/GetMessages';
import {
    setMessages,
    setTotalMessages,
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
        this.dispatch(setMessages([...this.getState().chat.messages, message]));
        this.dispatch(setTotalMessages(this.getState().chat.totalMessages + 1));
        this.dispatch(updateNewMessageToConversation(message));
        this.sendMessageUseCase.invoke(message).catch(this.handleError);
    };

    public getMessages = (userId: string, page = 0, limit = 30) => {
        this.getMessagesUseCase.invoke(userId, page, limit).then(({ data, total }) => {
            if (page > 0 && userId === this.getState().chat.selectedConversation?.userId) {
                this.dispatch(setMessages([...data, ...this.getState().chat.messages]));
            } else {
                this.dispatch(setMessages(data));
                this.dispatch(setTotalMessages(total));
            }
        });
    };

    public appendMessage = (message: Message) => {
        if (message.fromUid === this.getState().chat.selectedConversation?.userId) {
            this.dispatch(setMessages([...this.getState().chat.messages, message]));
            this.dispatch(setTotalMessages(this.getState().chat.totalMessages + 1));
        }
    };

    public updateStatusMessage = (message: Message) => {
        if (message.fromUid === this.getState().app.userData?._id) {
            this.dispatch(updateStatusMessage(message));
        }
    };
}

export default MessageController;
