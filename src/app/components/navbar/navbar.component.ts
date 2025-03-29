import { UserService } from './../../core/services/user.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import {
  ICourse,
  ICourseCart,
  ICourseOverview,
} from '../../shared/interfaces/course.interfaces';
import { WishlistService } from '../../core/services/wishlist.service';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { WebRole } from '../../shared/enums/user.enum';

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

  @ViewChild('empty', { static: true }) emptyRef!: TemplateRef<any>;
  @ViewChild('leanerMid', { static: true }) leanerMid!: TemplateRef<any>;
  @ViewChild('instructorMid', { static: true })
  instructorMid!: TemplateRef<any>;

  searchText: string = '';

  leanerItems = [
    {
      icon: 'heart',
      routerLink: 'wishlist',
      badge: 0,
      dropDown: this.wishListDropdown,
    },
    {
      icon: 'shopping-cart',
      routerLink: 'cart',
      badge: 0,
      dropDown: this.cartDropdown,
    },
    {
      icon: 'bell',
      routerLink: 'notification',
      badge: 0,
      dropdown: this.notificationDropdown,
    },
    {
      icon: 'message',
      routerLink: 'chat',
      badge: 0,
      dropdown: this.messageDropdown,
    },
  ];

  instructorItems = [
    {
      icon: 'bell',
      routerLink: 'notification',
      badge: 0,
      dropdown: this.notificationDropdown,
    },
    {
      icon: 'message',
      routerLink: 'chat',
      badge: 0,
      dropdown: this.messageDropdown,
    },
  ];

  instructorsNavItems = [
    {
      label: 'LABEL.HOME',
      routerLink: '',
    },
    {
      label: 'LABEL.COURSES',
      routerLink: '/my-courses',
    },
    {
      label: 'LABEL.MATERIALS',
      routerLink: '/materials',
    },
    {
      label: 'LABEL.REVENUE',
      routerLink: '/my-revenue',
    },
  ];

  expertNavItems = [
    {
      label: 'LABEL.COURSES_MANAGE',
      routerLink: '/courses-manage',
    },
    {
      label: 'LABEL.LEARNING_PATH',
      routerLink: '/learning-path-manage',
    },
  ];

  staffNavItems = [
    {
      label: 'LABEL.HOME',
      routerLink: '',
    },
    {
      label: 'LABEL.COURSES_MANAGE',
      routerLink: '/courses-manage',
    },
    {
      label: 'LABEL.USERS_MANAGE',
      routerLink: '/users-manage',
    },
    {
      label: 'LABEL.VIOLATION_MANAGE',
      routerLink: '/violations-manage',
    },
    {
      label: 'LABEL.PLATFORM_SETTINGS',
      routerLink: '/platform-settings',
    },
  ];

  adminNavItems = [
    {
      label: 'LABEL.HOME',
      routerLink: '',
    },
    {
      label: 'LABEL.USERS_MANAGE',
      routerLink: '/users-manage',
    },
    {
      label: 'LABEL.PLATFORM_SETTINGS',
      routerLink: '/platform-settings',
    },
    {
      label: 'LABEL.LOGS',
      routerLink: '/logs',
    },
  ];

  middleNavigationItems: any = [];

  iconItems: any[] = [];

  user: IUser | null = null;

  googleIcon = faGoogle;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private cart: CartService,
    private wishlist: WishlistService,
    private UserService: UserService
  ) {}
  subscription$: Subscription = new Subscription();

  ngOnInit() {
    this.listenCartItems();
    this.listenWishlistItems();
    this.listenToUser();
    this.subscription$.add(
      this.route.queryParams.subscribe((params) => {
        this.searchText = params['keyword']
          ? decodeURIComponent(params['keyword'])
          : '';
      })
    );
  }

  initNavbarItems() {
    if (!this.user) {
      this.iconItems = [];
      return;
    }

    switch (this.user.roleId) {
      case WebRole.LEARNER:
        this.middleNavigationItems = [];
        this.iconItems = this.leanerItems;
        break;
      case WebRole.INSTRUCTOR:
        this.middleNavigationItems = this.instructorsNavItems;
        this.iconItems = this.instructorItems;
        break;
      case WebRole.EXPERT:
        this.middleNavigationItems = this.expertNavItems;
        this.iconItems = this.instructorItems;
        break;
      case WebRole.STAFF:
        this.iconItems = this.instructorItems;
        this.middleNavigationItems = this.staffNavItems;
        break;
      case WebRole.ADMIN:
        this.iconItems = this.instructorItems;
        this.middleNavigationItems = this.adminNavItems;
        break;
      default:
        this.iconItems = [];
    }
  }

  getTemplate(key: string) {
    switch (key) {
      case 'wishlist':
        return this.wishListDropdown;
      case 'cart':
        return this.cartDropdown;
      case 'notification':
        return this.notificationDropdown;
      case 'chat':
        return this.messageDropdown;
      case 'profile':
        return this.profileDropdown;
      default:
        return null;
    }
  }

  goToProfilePage() {
    if (
      ![WebRole.INSTRUCTOR, WebRole.LEARNER].includes(
        this.user?.roleId || WebRole.GUEST
      )
    ) {
      return;
    }
    this.router.navigate(['/profile']);
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.initNavbarItems();
      })
    );
  }

  listenCartItems() {
    this.subscription$.add(
      this.cart.cart$.subscribe((cart: ICourseCart) => {
        let cartItem = this.iconItems.find((i) => i.routerLink === 'cart');
        if (cartItem) {
          cartItem.badge = cart.courses.length;
        }
      })
    );
  }

  listenWishlistItems() {
    this.subscription$.add(
      this.wishlist.wishlist$.subscribe((wishlist: ICourseOverview[]) => {
        let wlItem = this.iconItems.find((i) => i.routerLink === 'wishlist');
        if (wlItem) {
          wlItem.badge = wishlist.length;
        }
      })
    );
  }

  onConfirmSearchCourse(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;
    this.router.navigate(['/courses'], {
      queryParams: { keyword: encodeURIComponent(this.searchText) },
    });
    this.searchText = '';
  }

  onBackHome() {
    this.router.navigate(['/']);
  }

  onExploreMore() {
    window.scrollTo({
      top: window.scrollY + window.innerHeight - 30,
      behavior: 'smooth',
    });
  }

  onGetMiddleNavigation() {
    if (!this.user) return this.leanerMid;
    switch (this.user.roleId) {
      case WebRole.LEARNER:
        return this.leanerMid;
      case WebRole.EXPERT:
      case WebRole.STAFF:
      case WebRole.INSTRUCTOR:
      case WebRole.ADMIN:
        return this.instructorMid;
      default:
        return this.leanerMid;
    }
  }

  onSignIn() {
    this.router.navigate(['/signin']);
  }

  isRouteActive(route: string): boolean {
    if (this.router.url.trim() !== '/' && route.trim() === '') return false;
    return this.router.url.startsWith(`${route}`);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
