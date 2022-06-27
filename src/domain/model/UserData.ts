export interface UserData {
    _id: string;
    avatar?: string;
    name: string;
    relationshipStatus?: 'requested' | 'waiting' | 'friend' | 'stranger';
}
