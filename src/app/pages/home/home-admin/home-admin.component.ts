import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeAdminComponent implements OnInit {

  ngOnInit(): void { }

}
