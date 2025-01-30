import { Component, OnInit } from '@angular/core';
import { faCoins, faCube, faDragon, faFire, faRankingStar, faScrewdriverWrench, faVial } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-show-off',
  templateUrl: './home-show-off.component.html',
  styleUrls: ['./home-show-off.component.scss'],
})
export class HomeShowOffComponent implements OnInit {
  items = [
    {
      title: 'LABEL.EARN_EXP_LEVEL_UP_TITLE',
      content: 'LABEL.EARN_EXP_LEVEL_UP_CONTENT',
      icon: faVial,
    },
    {
      title: 'LABEL.COLLECT_GOLD_REWARDS_TITLE',
      content: 'LABEL.COLLECT_GOLD_REWARDS_CONTENT',
      icon: faCoins,
    },
    {
      title: 'LABEL.CUSTOMIZE_3D_FOX_TITLE',
      content: 'LABEL.CUSTOMIZE_3D_FOX_CONTENT',
      icon: faCube,
    },
    {
      title: 'LABEL.EQUIP_LEARNING_TOOLS_TITLE',
      content: 'LABEL.EQUIP_LEARNING_TOOLS_CONTENT',
      icon: faScrewdriverWrench,
    },
    {
      title: 'LABEL.COMPLETE_CHALLENGES_TITLE',
      content: 'LABEL.COMPLETE_CHALLENGES_CONTENT',
      icon: faDragon,
    },
    {
      title: 'LABEL.LEADERBOARD_ACHIEVEMENTS_TITLE',
      content: 'LABEL.LEADERBOARD_ACHIEVEMENTS_CONTENT',
      icon: faRankingStar,
    },
    {
      title: 'LABEL.STREAK_REWARDS_TITLE',
      content: 'LABEL.STREAK_REWARDS_CONTENT',
      icon: faFire,
    },
  ];
  constructor() {}

  ngOnInit() {}
}
