import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import {
  faDumbbell,
  faFlask,
  faHistory,
  faMicrochip,
  faLanguage,
  faMusic,
  faPaintBrush,
  faRuler,
  faUsers,
  faFlag,
  faStar,
  faSquareRootAlt,
  faCode,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shard',
  templateUrl: './shard.component.html',
  styleUrl: './shard.component.scss',
})
export class ShardComponent implements OnInit {
  @Input() shardName: string = '';
  @Input() customSize: number = 25;

  ngOnInit(): void {}

  getShardName() {
    return this.shardName[0]?.toLocaleUpperCase();
  }

  getShardIcon() {
    switch (this.shardName.toLocaleLowerCase()) {
      case 'math':
        return faSquareRootAlt;
      case 'science':
        return faFlask;
      case 'history':
        return faHistory;
      case 'english':
        return faLanguage;
      case 'social':
        return faUsers;
      case 'art':
        return faPaintBrush;
      case 'music':
        return faMusic;
      case 'physical':
        return faDumbbell;
      case 'technology':
        return faMicrochip;
      case 'japanese':
        return faFlag;
      case 'programming':
        return faCode;
      default:
        return faStar;
    }
  }
}
