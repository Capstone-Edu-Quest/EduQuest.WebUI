import { WebRole } from "../enums/user.enum";

export interface IUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: WebRole;
    createdAt: string;
    updatedAt: string;
}