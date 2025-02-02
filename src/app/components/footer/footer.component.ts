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

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @ViewChild('language', { static: true }) language!: TemplateRef<any>;

  eduquestLink = [
    { name: 'LABEL.ABOUT', link: '/about' },
    { name: 'LABEL.PRICING', link: '/pricing' },
    // { name: 'LABEL.CONTACT', link: '/contact' },
    { name: 'LABEL.HELP', link: '/help' },
    { name: 'LABEL.PRIVACY', link: '/privacy' },
    { name: 'LABEL.TERMS', link: '/terms' },
  ];

  private subscription$: Subscription = new Subscription();
  currentLanguage: string = this.translate.currentLang;

  constructor(
    private modal: ModalService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe((event) => {
        this.currentLanguage = event.lang;
      })
    );
  }

  onShowLanguageDialog() {
    this.modal.updateModalContent(this.language);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
