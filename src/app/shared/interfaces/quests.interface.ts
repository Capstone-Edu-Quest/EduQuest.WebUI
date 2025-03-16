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