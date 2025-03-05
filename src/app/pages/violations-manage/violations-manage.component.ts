import { Component, type OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-violations-manage',
  templateUrl: './violations-manage.component.html',
  styleUrl: './violations-manage.component.scss',
  animations: [fadeInOutAnimation]
})
export class ViolationsManageComponent implements OnInit {

  ngOnInit(): void {}
}
