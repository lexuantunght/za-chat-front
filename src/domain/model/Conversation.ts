import { FriendStatus } from '../../common/types/FriendStatus';
import { Message } from './Message';
import { UserData } from './UserData';

export interface Conversation {
    _id: string;
    users: Array<UserData>;
    latestMessage?: Message;
    name: string;
    avatar?: string;
    friendStatus: FriendStatus;
}
