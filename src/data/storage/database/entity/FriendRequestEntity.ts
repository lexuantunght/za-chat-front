export interface FriendRequestEntity {
    _id: string;
    fromUid: string;
    requestText?: string;
    requestTime: Date;
}
