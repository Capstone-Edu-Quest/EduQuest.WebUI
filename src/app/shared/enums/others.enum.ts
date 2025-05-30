export enum RewardTypeEnum {
    GOLD = 1,
    EXP,
    ITEM,
    COUPON,
    BOOSTER // 5
}

export enum QuestMissionEnum {
    LESSONS = 1, // Complete X LESSONS
    LESSONS_TIME, // Complete X LESSONS in Y minutes

    MATERIALS, // Complete X materials (Quiz, Video, ...)
    MATERIALS_TIME, // Complete X materials in Y minutes

    QUIZ, // Complete X Quizzes
    QUIZ_TIME, // Complete X Quizzes in Y minutes

    COURSES, // Complete X Courses
    COURSES_TIME, // Complete X Courses in Y minutes

    LEARNING_TIME, // Spend X minutes learning
    LEARNING_TIME_TIME, // Spend X minutes learning in Y minutes

    STREAK, //11  // Study X days
}

export enum QuestTypeEnum {
    DAILY = 1,
    ONE_TIME // 2
}

export enum BoosterEnum {
    EXP = 1,
    GOLD
}

export enum SubscribtionNameEnum {
    PRICE = 'APIsPackagePrice',
    NUMBERS = 'APIsPackageNumbers'
}

export enum PaymentConfigEnum {
    PURCHASED_PRO_MONTHLY = 1,
    PURCHASED_PRO_YEARLY = 2
}

export enum TransactionStatusEnum{
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    EXPIRED = "expired",
    CANCELLED = "canceled"
}

export enum TransactionTypeEnum {
    CART = "checkoutcart",
    REFUND = "refund",
    SUBSCRIPTION = "proaccount",
    TRANSFER = "transfer"
}