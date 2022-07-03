import { PagingData } from '../../../common/types/PagingData';
import { Message } from '../../../domain/model/Message';
import appConfig from '../../../utils/app/appConfig';
import objectToFormData from '../../../utils/helpers/objectToFormData';
import Network from '../../networking/Network';
import Socket from '../../networking/Socket';
import MessageQueries from '../../storage/database/query/MessageQueries';
import SearchQueries from '../../storage/database/query/SearchQueries';
import MessageDataSource from '../MessageDataSource';
import { FileDataAPIEntity } from './entity/FileDataAPIEntity';
import { MessageAPIEntity } from './entity/MessageAPIEntity';

export default class MessageAPIDataSourceImpl implements MessageDataSource {
    private clientQuery;
    private seacrhQuery;
    constructor(clientQuery: MessageQueries) {
        this.clientQuery = clientQuery;
        this.seacrhQuery = new SearchQueries();
    }
    async getMessages(conversationId: string, fromSendTime?: Date, limit?: number) {
        if (Network.getInstance().getIsErrorConnection()) {
            return this.clientQuery.getMessages(conversationId, fromSendTime, limit);
        }
        const response = await Network.getInstance().getHelper<PagingData<MessageAPIEntity>>(
            `${
                appConfig.baseUrl
            }/chat/messages?conversationId=${conversationId}&fromSendTime=${fromSendTime?.toISOString()}&limit=${limit}`
        );
        this.clientQuery.addMessages(response.data.data);
        response.data.data.forEach((msg) => this.seacrhQuery.addMessage(msg));
        return response.data || {};
    }
    async sendMessage(message: Message) {
        if (message.files && message.files.length > 0) {
            const response = await Network.getInstance().postHelper<FileDataAPIEntity[]>(
                `${appConfig.baseUrl}/chat/send-files`,
                objectToFormData({ files: message.files.map((f) => f.file) }),
                { Accept: 'application/json' }
            );
            if (response.status === 'success') {
                Socket.getInstance()
                    .getSocket()
                    .emit('send-message', {
                        ...message,
                        files: message.files.map((f, index) => ({
                            url: response.data[index].url,
                            type: f.type,
                            width: f.width,
                            height: f.height,
                        })),
                    });
            }
            return;
        }
        Socket.getInstance().getSocket().emit('send-message', message);
    }

    async searchMessages(keyword: string) {
        return this.seacrhQuery.searchMessages(keyword);
    }
}
