import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-platform-logs',
  templateUrl: './platform-logs.component.html',
  styleUrl: './platform-logs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformLogsComponent implements OnInit {

  ngOnInit(): void { }

}
