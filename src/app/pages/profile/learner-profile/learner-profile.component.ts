import { Component, Input, OnInit } from '@angular/core';
import { IProfile, IUser } from '../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-learner-profile',
  templateUrl: './learner-profile.component.html',
  styleUrls: ['./learner-profile.component.scss']
})
export class LearnerProfileComponent implements OnInit {
  @Input('user') user: IProfile | null = null;
  @Input('isStaffView') isStaffView: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
