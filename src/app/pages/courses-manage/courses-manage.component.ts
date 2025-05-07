import { Subscription } from 'rxjs';
import { UserService } from './../../core/services/user.service';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { WebRole } from '../../shared/enums/user.enum';

@Component({
  selector: 'app-courses-manage',
  templateUrl: './courses-manage.component.html',
  styleUrl: './courses-manage.component.scss',
})
export class CoursesManageComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  tabs: any[] = [];

  constructor(private UserService: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.initTabs(user ? user.roleId : WebRole.GUEST);
      })
    );
  }

  initTabs(userRoleId: WebRole) {
    this.tabs = [];

    // if (userRoleId === WebRole.EXPERT) {
    // }

    this.tabs.push({ label: 'LABEL.COUSRE_APPROVAL', link: 'approval' });

    if ([WebRole.ADMIN, WebRole.STAFF].includes(userRoleId)) {
      this.tabs.push(
        // { label: 'LABEL.COUSRE_STATISTICS', link: 'statistics' },
        { label: 'LABEL.COUSRE_CATEGORIZE', link: 'categorize' }
      );
    }

    this.tabs.push(...[{ label: 'LABEL.COURSE_EXPLORE', link: 'explore' }]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
