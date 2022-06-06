import { Message } from '../../../domain/model/Message';
import appConfig from '../../../utils/app/appConfig';
import Network from '../../networking/Network';
import MessageDataSource from '../MessageDataSource';
import { MessageAPIEntity } from './entity/MessageAPIEntity';

export default class MessageAPIDataSourceImpl implements MessageDataSource {
    async getMessages() {
        const response = await Network.getInstance().getHelper<MessageAPIEntity[]>(
            `${appConfig.baseUrl}/conversations`
        );
        return response.data || [];
    }
    async sendMessage(message: Message) {
        await Network.getInstance().postHelper<Message>(`${appConfig.baseUrl}/chat/send`, {});
    }
}
