import { Message } from '../../domain/model/Message';

export default interface MessageDataSource {
    getMessages(): Promise<Message[]>;
    sendMessage(message: Message): Promise<void>;
}
