export interface UserInfoEntity {
    _id: string;
    name: string;
    avatar?: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
