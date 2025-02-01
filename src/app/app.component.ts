import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { defaultLanguage } from './shared/constants/languages.constant';
import { StorageService } from './core/services/storage.service';
import { localStorageEnum } from './shared/enums/localStorage.enum';
import { Subscription } from 'rxjs';
import AOS from 'aos';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { NotificationService } from './core/services/notification.service';
import { UserService } from './core/services/user.service';
import { ChatService } from './core/services/chat.service';
import { ModalService } from './core/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  savedTheme: string = '';
  subscription$: Subscription = new Subscription();

  constructor(
    private ThemeService: ThemeService,
    private translate: TranslateService,
    private storage: StorageService,
    private cart: CartService,
    private wishlist: WishlistService,
    private notification: NotificationService,
    private user: UserService,
    private chat: ChatService,
    public modal: ModalService
  ) {}

  ngOnInit(): void {
    this.ThemeService.onInitTheme();
    this.onInitLanguage();
    this.initAOS();
    this.listenToUser();
  }

  initAOS() {
    AOS.init({
      duration: 850, // Animation duration in milliseconds
      once: true, // Whether animation should only happen once
      easing: 'ease-in-out', // Easing option
    });
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        if (user) {
          this.initUserData();
        } else {
          this.resetUserData();
        }
      })
    );
  }

  initUserData() {
    this.cart.initCart();
    this.wishlist.initWishlist();
    this.notification.initNotifications();
    this.chat.initChat();
  }

  resetUserData() {
    this.cart.destroyCart();
    this.wishlist.destroyWishList();
    this.notification.destroyNotification();
    this.chat.destroyChat();
  }

  onInitLanguage() {
    const savedLanguage =
      this.storage.getFromLocalStorage(localStorageEnum.LANGUAGE) ??
      defaultLanguage;
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.use(savedLanguage);

    this.translate.onLangChange.subscribe((event) =>
      this.storage.setToLocalStorage(localStorageEnum.LANGUAGE, event.lang)
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
