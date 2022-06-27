export interface UserDataAPIEntity {
    _id: string;
    avatar?: string;
    name: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
