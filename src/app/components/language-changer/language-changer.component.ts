import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { avaiableLanguage } from '../../shared/constants/languages.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-changer',
  templateUrl: './language-changer.component.html',
  styleUrls: ['./language-changer.component.scss'],
})
export class LanguageChangerComponent implements OnInit, OnDestroy {
  constructor(public translate: TranslateService) {}

  currentLanguage: string = this.translate.currentLang;
  avaiableLanguage: string[] = avaiableLanguage;
  private subscription$: Subscription = new Subscription();

  ngOnInit() {
    this.subscription$.add(
      this.translate.onLangChange.subscribe((event) => {
        this.currentLanguage = event.lang;
      })
    );
  }

  onChangeLanguage(code: string) {
    if (code === this.currentLanguage) return;

    this.translate.use(code);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
