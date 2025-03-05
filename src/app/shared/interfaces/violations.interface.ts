import { ViolationActionEnum, ViolationsStatusEnum, ViolationsTypeEnum } from "../enums/violations.enum";

export interface IViolation {
    id: string;
    reporter: IViolationUser;
    violator: IViolationUser;
    type: ViolationsTypeEnum;
    reason: string;
    reportedObject: IReportedCourse | IReportFeedback | null; // course | feedback | user
    status: ViolationsStatusEnum;
    repsonse?: {
        time: string;
        comment: string;
        action: ViolationActionEnum | null;
    }
}

export interface IViolationUser {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface IReportedCourse {
    id: string;
    name: string;
}

export interface IReportFeedback {
    id: string;
    rating: number;
    content: string;
}

export interface IViolationCount {
    id: string;
    numberOfViolated: number;
    name: string;
    email: string;
    phone: string;
}
