export interface UserInfoEntity {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
    phoneNumber?: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
