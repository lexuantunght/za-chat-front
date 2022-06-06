import BaseController from '../BaseController';
import { Message } from '../../domain/model/Message';
import { SendMessage } from '../../domain/usecase/message/SendMessage';

class MessageController extends BaseController {
    private sendMessageUseCase;

    constructor() {
        super();
        this.sendMessageUseCase = new SendMessage();
    }

    public sendMessage = (message: Message) => {
        this.sendMessageUseCase.invoke(message).catch(this.handleError);
    };
}

export default MessageController;
