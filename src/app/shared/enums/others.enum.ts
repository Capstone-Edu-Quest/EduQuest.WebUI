export enum RewardTypeEnum {
    GOLD = 1,
    EXP,
    ITEM,
    COUPON,
    BOOSTER // 5
}

export enum QuestMissionEnum {
    STAGES = 1, // Complete X Stages
    STAGES_TIME, // Complete X Stages in Y minutes

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
