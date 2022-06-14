import { Message } from '../../../domain/model/Message';
import appConfig from '../../../utils/app/appConfig';
import objectToFormData from '../../../utils/helpers/objectToFormData';
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
        if (message.files && message.files.length > 0) {
            const response = await Network.getInstance().postHelper<string[]>(
                `${appConfig.baseUrl}/chat/send-files`,
                objectToFormData({ files: message.files.map((f) => f.file) }),
                { Accept: 'application/json' }
            );
            if (response.status === 'success') {
                Socket.getInstance()
                    .getSocket()
                    .emit('send-message', {
                        ...message,
                        files: response.data.map((url) => ({ url })),
                    });
            }
            return;
        }
        Socket.getInstance().getSocket().emit('send-message', message);
    }
}
