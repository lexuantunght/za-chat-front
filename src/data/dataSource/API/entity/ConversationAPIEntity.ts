import { MessageAPIEntity } from './MessageAPIEntity';
import { UserDataAPIEntity } from './UserDataAPIEntity';

export interface ConversationAPIEntity {
    _id: string;
    users: Array<UserDataAPIEntity>;
    latestMessage?: MessageAPIEntity;
    name: string;
    avatar: string;
    friendStatus?: 'requested' | 'friend' | 'waiting';
}
