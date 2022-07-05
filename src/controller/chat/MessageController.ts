import BaseController from '../BaseController';
import { Message } from '../../domain/model/Message';
import { SendMessage } from '../../domain/usecase/message/SendMessage';
import { GetMessages } from '../../domain/usecase/message/GetMessages';
import {
    setIsEndBottomMsgList,
    setIsEndTopMsgList,
    setIsOpenSearch,
    setMessages,
    setSearchKeyword,
    setSearchMsgResult,
    setTotalMessages,
    updateNewMessageToConversation,
    updateStatusMessage,
} from '../../presentation/Chat/reducer';
import { SearchMessages } from '../../domain/usecase/message/SearchMessages';
import { NavigateMessage } from '../../domain/usecase/message/NavigateMessage';

class MessageController extends BaseController {
    private sendMessageUseCase;
    private getMessagesUseCase;
    private searchMessagesUseCase;
    private navigateMessageUseCase;

    constructor() {
        super();
        this.sendMessageUseCase = new SendMessage();
        this.getMessagesUseCase = new GetMessages();
        this.searchMessagesUseCase = new SearchMessages();
        this.navigateMessageUseCase = new NavigateMessage();
    }

    public sendMessage = (message: Message) => {
        this.dispatch(setMessages([...this.getState().chat.messages, message]));
        this.dispatch(setTotalMessages(this.getState().chat.totalMessages + 1));
        this.dispatch(updateNewMessageToConversation(message));
        this.sendMessageUseCase.invoke(message).catch(this.handleError);
    };

    public getMessages = (
        conversationId: string,
        fromSendTime = Date.now(),
        limit = 30,
        isPrepend = false,
        later = false
    ) => {
        this.dispatch(setIsEndTopMsgList(false));
        this.getMessagesUseCase
            .invoke(conversationId, fromSendTime, limit, later)
            .then(({ data, total }) => {
                if (data.length === 0) {
                    if (later) {
                        this.dispatch(setIsEndBottomMsgList(true));
                    } else {
                        this.dispatch(setIsEndTopMsgList(true));
                    }
                    return;
                }
                if (
                    isPrepend &&
                    conversationId === this.getState().chat.selectedConversation?._id
                ) {
                    if (later) {
                        this.dispatch(setMessages([...this.getState().chat.messages, ...data]));
                    } else {
                        this.dispatch(setMessages([...data, ...this.getState().chat.messages]));
                    }
                } else {
                    this.dispatch(setMessages(data));
                    this.dispatch(setTotalMessages(total));
                }
            });
    };

    public navigateMessage = (
        conversationId: string,
        fromSendTime: number,
        msgId: string,
        limit = 30
    ) => {
        this.dispatch(setIsEndTopMsgList(false));
        this.dispatch(setIsEndBottomMsgList(false));
        this.navigateMessageUseCase
            .invoke(conversationId, fromSendTime, msgId, limit)
            .then(({ data, total }) => {
                this.dispatch(setMessages(data));
                this.dispatch(setTotalMessages(total));
            });
    };

    public appendMessage = (message: Message) => {
        if (message.fromUid === this.getState().chat.selectedConversation?.user._id) {
            this.dispatch(setMessages([...this.getState().chat.messages, message]));
            this.dispatch(setTotalMessages(this.getState().chat.totalMessages + 1));
        }
    };

    public updateStatusMessage = (message: Message) => {
        if (message.fromUid === this.getState().app.userData?._id) {
            this.dispatch(updateStatusMessage(message));
        }
    };

    public toggleSearch = (isOpen?: boolean) => {
        if (!isOpen) {
            this.dispatch(setSearchKeyword());
            this.dispatch(setSearchMsgResult());
        }
        this.dispatch(setIsOpenSearch(isOpen));
    };

    public searchMessages = (keyword: string, conversationId?: string) => {
        if (keyword !== '') {
            this.dispatch(setSearchKeyword(keyword));
            this.searchMessagesUseCase.invoke(keyword, conversationId, (pagingData) =>
                this.dispatch(setSearchMsgResult(pagingData.data))
            );
        }
    };
}

export default MessageController;
