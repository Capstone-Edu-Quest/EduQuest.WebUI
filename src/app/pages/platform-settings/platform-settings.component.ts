import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WebRole } from '../../shared/enums/user.enum';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrl: './platform-settings.component.scss',
})
export class PlatformSettingsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  defaultTabs: any[] = [
    { label: 'LABEL.STATISTICS', link: '/platform-settings' },
  ];

  staffTabs: any[] = [
    { label: 'LABEL.LEVEL_EXP', link: 'level' },
    { label: 'LABEL.QUESTS', link: 'quests' },
    { label: 'LABEL.SHOP_ITEMS', link: 'shop-items' },
    { label: 'LABEL.COUPONS', link: 'coupons' },
  ]

  adminTabs: any[] = [
    { label: 'LABEL.PACKAGES_SETTINGS', link: 'packages-settings' },
  ];

  tabs: any[] = [];

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.tabs = [...this.defaultTabs];
        if (user) {
          switch (user.roleId) {
            case WebRole.ADMIN:
              this.tabs.push(...this.adminTabs);
              break;
            case WebRole.STAFF:
              this.tabs.push(...this.staffTabs);
              break;
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
