export enum ViolationsTypeEnum {
    USER = 1,
    COURSE,
    FEEDBACK
}

export enum ViolationsStatusEnum {
    PENDING = 1,
    RESOLVED,
    REJECTED
}

export enum ViolationActionEnum {
    WARN = 1,
    WARN_DELETE,
    SUSPEND
}