import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import {
  Component,
  Host,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { FirebaseService } from './core/services/firebase.service';
import { LoadingService } from './core/services/loading.service';
import { FoxService } from './core/services/fox.service';
import { QuestsService } from './core/services/quests.service';
import { LearningPathService } from './core/services/learning-path.service';
import { CoursesService } from './core/services/courses.service';
import { IUser } from './shared/interfaces/user.interfaces';
import { WebRole } from './shared/enums/user.enum';
import { PlatformService } from './core/services/platform.service';
import { PaymentService } from './core/services/payment.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  savedTheme: string = '';
  subscription$: Subscription = new Subscription();
  isLoading: boolean = false;

  timeOut: any = null;

  constructor(
    private ThemeService: ThemeService,
    private translate: TranslateService,
    private storage: StorageService,
    private cart: CartService,
    private wishlist: WishlistService,
    private notification: NotificationService,
    private user: UserService,
    private chat: ChatService,
    public modal: ModalService,
    private firebase: FirebaseService,
    private loading: LoadingService,
    private fox: FoxService,
    private quests: QuestsService,
    private learningPath: LearningPathService,
    private course: CoursesService,
    private platform: PlatformService,
    private payment: PaymentService
  ) {}

  ngOnInit(): void {
    this.listenToLoading();
    this.user.initUser();
    this.ThemeService.onInitTheme();
    this.onInitLanguage();
    this.initAOS();
    // this.firebase.init();
    this.listenToUser();
  }

  listenToLoading() {
    this.subscription$.add(
      this.loading.loading$.subscribe((loading) => {
        this.isLoading = loading;
      })
    );
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
          this.initUserData(user);
        } else {
          this.resetUserData();
        }
      })
    );
  }

  initUserData(user: IUser) {
    switch (user.roleId) {
      case WebRole.LEARNER:
        this.cart.initCart();
        this.wishlist.initWishlist();
        this.fox.initFox();
        this.quests.initUserQuest();
        this.learningPath.initMyLearningPath();
        break;
      case WebRole.INSTRUCTOR:
        this.course.onInitMyMaterials();
        // this.payment.getConnectedAccount();
        break;
      case WebRole.ADMIN:
      case WebRole.STAFF:
        this.user.initAdminDashboards();
        this.platform.initPlatformStats();
        break;
      case WebRole.EXPERT:
        this.learningPath.initMyLearningPath();
        break;
    }

    // clearTimeout(this.timeOut);
    // this.timeOut = setTimeout(() => {
    //   this.notification.initNotifications();
    //   this.chat.initChat();
    // }, 1000);
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
