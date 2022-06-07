import { DataObject } from './DataObject';

export interface RegisterData extends DataObject {
    name: string;
    username: string;
    phoneNumber: string;
    avatar?: File;
    password: string;
    confirmPassword?: string;
}
