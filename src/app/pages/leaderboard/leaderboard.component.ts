import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { PlatformService } from '../../core/services/platform.service';
import {
  ILeaderboard,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent implements OnInit {
  leaderboards: ILeaderboard[] = [];
  top3: ILeaderboard[] = [];

  constructor(private platform: PlatformService) {}

  ngOnInit(): void {
    this.initLeaderboard();
  }

  initLeaderboard() {
    this.leaderboards = [];
    this.platform.getLeaderboard().subscribe((res) => {
      if (!res?.payload) return;

      this.leaderboards = res.payload.sort((a, b) => a.rank - b.rank);

      this.top3 = this.leaderboards.slice(0, 3);
      this.leaderboards = this.leaderboards.slice(3, this.leaderboards.length);

      const temp = this.top3[0];
      this.top3[0] = this.top3[1];
      this.top3[1] = temp;
    });
  }
}
