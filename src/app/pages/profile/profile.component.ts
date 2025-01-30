import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ProfileComponent implements OnInit {
  isInstructor: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
