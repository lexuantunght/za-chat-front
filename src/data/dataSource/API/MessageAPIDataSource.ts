import { Message } from '../../../domain/model/Message';
import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import Socket from '../../networking/Socket';
import MessageDataSource from '../MessageDataSource';
import { MessageAPIEntity } from './entity/MessageAPIEntity';

export default class MessageAPIDataSourceImpl implements MessageDataSource {
    async getMessages(conversationId: string) {
        const response = await Network.getInstance().getHelper<MessageAPIEntity[]>(
            `${appConfig.baseUrl}/chat/messages?conversationId=${conversationId}`
        );
        return response.data || [];
    }
    async sendMessage(message: Message) {
        Socket.getInstance().getSocket().emit('send-message', message);
    }
}
