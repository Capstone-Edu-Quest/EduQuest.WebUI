import { UserService } from './../../../core/services/user.service';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { ModalService } from '../../../core/services/modal.service';
import { IUser } from '../../../shared/interfaces/UserInterfaces';

@Component({
  selector: 'app-navbar-profile',
  templateUrl: './navbar-profile.component.html',
  styleUrls: ['./navbar-profile.component.scss'],
})
export class NavbarProfileComponent implements OnInit, OnDestroy {
  @ViewChild('language', { static: true }) languageTemplate!: TemplateRef<any>;
  subscription$: Subscription = new Subscription();

  routeItems: any[] = [];
  user: IUser | null = null;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private theme: ThemeService,
    private modal: ModalService,
    private UserService: UserService
  ) {}

  ngOnInit() {
    this.onInitRouteItems();
    this.listenToLanguage();
    this.listenToTheme();
    this.listenToUser();
  }

  onInitRouteItems() {
    this.routeItems = [
      {
        name: 'LABEL.PROFILE',
        action: () => this.router.navigate(['/profile']),
      },
      {
        name: 'LABEL.MY_LEARNING',
        action: () => this.router.navigate(['/my-learning']),
      },
      {
        name: 'LABEL.SETTINGS',
        action: () => this.router.navigate(['/settings']),
      },
      {
        name: 'LABEL.TRANSACTIONS',
        action: () => this.router.navigate(['/transactions']),
      },
      {
        name: null,
      },
      {
        name: 'LABEL.LANGUAGE',
        value: {
          icon: 'global',
          value: `LANGUAGES.${this.translate.currentLang.toUpperCase()}`,
        },
        action: () => this.onShowLanguageDialog(),
      },
      {
        name: 'LABEL.THEME',
        value: {
          icon: 'format-painter',
          value: '',
        },
        action: () => this.theme.onGoToNextTheme(),
      },
      {
        name: null,
      },
      {
        name: 'LABEL.BECOME_AN_INSTRUCTOR',
        action: () => this.router.navigate(['/create-course']),
      },
      {
        name: 'LABEL.PRICING',
        action: () => this.router.navigate(['/pricing']),
      },
      {
        name: 'LABEL.HELP',
        action: () => this.router.navigate(['/help']),
      },
      {
        name: 'LABEL.LOGOUT',
      },
    ];
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  listenToLanguage() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe((event) => {
        const langItem = this.routeItems.find(
          (item) => item.name === 'LABEL.LANGUAGE'
        );

        if (langItem && langItem.value) {
          langItem.value.value = `LANGUAGES.${event.lang.toUpperCase()}`;
        }
      })
    );
  }

  listenToTheme() {
    this.subscription$.add(
      this.theme.currentTheme$.subscribe((theme) => {
        const langItem = this.routeItems.find(
          (item) => item.name === 'LABEL.THEME'
        );

        if (langItem && langItem.value) {
          langItem.value.value = `LABEL.${theme.toUpperCase()}_MODE`;
        }
      })
    );
  }

  onRunRouteAction(action: any) {
    if (!action) return;
    action();
  }

  onShowLanguageDialog() {
    console.log(this.languageTemplate);
    this.modal.updateModalContent(this.languageTemplate);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
