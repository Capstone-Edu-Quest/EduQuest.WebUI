import { QuestMissionEnum, QuestTypeEnum, RewardTypeEnum } from "../enums/others.enum";

export interface IQuest {
    id: string;
    title: string;
    type: QuestTypeEnum;
    questType: QuestMissionEnum;
    questValue: (number | string)[];
    rewardType: RewardTypeEnum[];
    rewardValue: (number | string)[];
}

export interface IQuestOfUser extends IQuest {
    startDate: string;
    dueDate: string | null;
    isCompleted: boolean;
    pointToComplete: number;
    currentPoint: number;
}

export interface IQuestOfUserQuery {
    title?: string;
    type?: QuestTypeEnum;
    questType?: QuestMissionEnum;
    pointToComplete?: number;
    startDate?: string;
    isCompleted?: boolean;
    dueDate?: string;
    pageNo?: number;
    eachPage?: number;
}