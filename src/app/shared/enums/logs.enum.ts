export enum LogsActionType {
    COURSE_ASSIGN_EXPERT = 1,
    COURSE_APPROVAL, // reject or approve
    COURSE_SUSPEND,

    COURSE_CATEGORIZE,
    TAGS, // CRUD

    USER_WARN,
    USER_SUSPEND,
    USER_CHANGE_ROLE,

    VIOLATIONS, // CRUD

    SETTINGS_LEVELS, // CRUD
    SETTINGS_QUESTS, // CRUD
    SETTINGS_SHOP_ITEMS, // CRUD
    SETTING_COUPONS, // CRUD
    SETTINGS_ADVANCE // Update package's price, numbers of package (commission fee, extra % gold...)
    // 14
}