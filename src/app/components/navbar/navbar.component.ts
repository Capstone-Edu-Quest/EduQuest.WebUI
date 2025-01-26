import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('wishListDropdown', { static: true })
  wishListDropdown!: TemplateRef<any>;
  @ViewChild('cartDropdown', { static: true }) cartDropdown!: TemplateRef<any>;
  @ViewChild('notificationDropdown', { static: true })
  notificationDropdown!: TemplateRef<any>;
  @ViewChild('messageDropdown', { static: true })
  messageDropdown!: TemplateRef<any>;
  @ViewChild('profileDropdown', { static: true })
  profileDropdown!: TemplateRef<any>;

  searchText: string = '';
  iconItems = [
    {
      icon: 'heart',
      routerLink: 'wishlist',
      badge: 5,
      dropDown: this.wishListDropdown,
    },
    {
      icon: 'shopping-cart',
      routerLink: 'cart',
      badge: 1,
      dropDown: this.cartDropdown,
    },
    {
      icon: 'bell',
      routerLink: 'notification',
      badge: 3,
      dropdown: this.notificationDropdown,
    },
    {
      icon: 'message',
      routerLink: 'message',
      badge: 8,
      dropdown: this.messageDropdown,
    },
  ];

  constructor(private translate: TranslateService, private router: Router, private route: ActivatedRoute) {}
  subscription$: Subscription = new Subscription();

  ngOnInit() {
    this.subscription$.add(
      this.route.queryParams.subscribe((params) => {
        this.searchText = params['keyword'] ? decodeURIComponent(params['keyword']) : '';
      })
    );
  }

  getTemplate(key: string) {
    switch (key) {
      case 'wishlist':
        return this.wishListDropdown;
      case 'cart':
        return this.cartDropdown;
      case 'notification':
        return this.notificationDropdown;
      case 'message':
        return this.messageDropdown;
      case 'profile':
        return this.profileDropdown;
      default:
        return null;
    }
  }

  onConfirmSearchCourse(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;
    this.router.navigate(['/courses'], {
      queryParams: { keyword: encodeURIComponent(this.searchText) },
    });
  }

  onBackHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
