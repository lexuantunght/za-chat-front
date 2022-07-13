export interface UserDataAPIEntity {
    _id: string;
    avatar?: string;
    name: string;
    username?: string;
    phoneNumber?: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
