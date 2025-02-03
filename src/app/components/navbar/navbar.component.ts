import { UserService } from './../../core/services/user.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { ICourse, ICourseCart } from '../../shared/interfaces/CourseInterfaces';
import { WishlistService } from '../../core/services/wishlist.service';
import { IUser } from '../../shared/interfaces/UserInterfaces';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

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
      routerLink: 'message',
      badge: 0,
      dropdown: this.messageDropdown,
    },
  ];

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

  goToProfilePage() {
    this.router.navigate(['/profile']);
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
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
      this.wishlist.wishlist$.subscribe((wishlist: ICourse[]) => {
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

  onSignIn() {
    this.UserService.signInWithGoogle();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
