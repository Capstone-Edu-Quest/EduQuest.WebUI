import { UserService } from './../../core/services/user.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ModalService } from '../../core/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @ViewChild('language', { static: true }) language!: TemplateRef<any>;

  user!: IUser | null;

  defaultTabs = [
    { name: 'LABEL.ABOUT', link: '/about' },
    { name: 'LABEL.PRICING', link: '/pricing' },
    // { name: 'LABEL.CONTACT', link: '/contact' },
    { name: 'LABEL.HELP', link: '/help' },
    { name: 'LABEL.PRIVACY', link: '/privacy' },
    { name: 'LABEL.TERMS', link: '/terms' },
  ];

  normalUserTabs = []

  eduquestLink: any[] = [...this.defaultTabs];

  private subscription$: Subscription = new Subscription();
  currentLanguage: string = this.translate.currentLang;

  constructor(
    private modal: ModalService,
    private translate: TranslateService,
    private UserService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe((event) => {
        this.currentLanguage = event.lang;
      })
    );

    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.eduquestLink = [...this.defaultTabs];
        this.user = user;

        if (
          !user ||
          [WebRole.INSTRUCTOR].includes(user.roleId)
        ) {
          this.defaultTabs.push(...this.normalUserTabs);
        }
      })
    );
  }

  onShowLanguageDialog() {
    this.modal.updateModalContent(this.language);
  }

  becomeInstructor() {
    this.router.navigate(['/become-instructor'])
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
