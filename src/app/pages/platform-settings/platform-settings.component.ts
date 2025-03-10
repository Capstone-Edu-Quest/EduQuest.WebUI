import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-settings',
  templateUrl: './platform-settings.component.html',
  styleUrl: './platform-settings.component.scss',
})
export class PlatformSettingsComponent implements OnInit {
  tabs: any[] = [
    { label: 'LABEL.STATISTICS', link: '/platform-settings' },
    { label: 'LABEL.LEVEL_EXP', link: 'level' },
    { label: 'LABEL.QUESTS', link: 'quests' },
    { label: 'LABEL.SHOP_ITEMS', link: 'shop-items' },
    { label: 'LABEL.PRICING', link: 'pricing' },
    { label: 'LABEL.COUPONS', link: 'coupons' },
  ];

  constructor() {}

  ngOnInit(): void {}

}
