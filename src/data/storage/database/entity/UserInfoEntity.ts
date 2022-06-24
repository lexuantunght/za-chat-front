export interface UserInfoEntity {
    userId: string;
    name: string;
    avatar?: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
