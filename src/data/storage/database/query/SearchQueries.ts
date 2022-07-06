import { PagingData } from '../../../../common/types/PagingData';
import { MessageAPIEntity } from '../../../dataSource/API/entity/MessageAPIEntity';
import { MessageEntity } from '../entity/MessageEntity';

class SearchQueries {
    private worker;
    public constructor() {
        this.worker = new Worker('worker/search.worker.js');
    }

    public addMessages(messages: MessageEntity[]) {
        this.worker.postMessage({ type: 'input', messages });
    }

    public searchMessages(
        keyword: string,
        conversationId?: string,
        callback?: (result: PagingData<MessageAPIEntity>, subkeys?: string[]) => void
    ) {
        this.worker.postMessage({ type: 'search', keyword, conversationId });
        this.worker.onmessage = (e) => {
            const { messages, total, subkeys } = e.data;
            callback?.({ data: messages, total }, subkeys);
        };
    }
}

export default SearchQueries;
