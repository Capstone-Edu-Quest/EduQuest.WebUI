import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { defaultLanguage } from './shared/constants/languages.constant';
import { ModalService } from './core/services/modal.service';
import { StorageService } from './core/services/storage.service';
import { localStorageEnum } from './shared/enums/localStorage.enum';
import { Subscription } from 'rxjs';
import AOS from 'aos';

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
    public modal: ModalService
  ) {}

  ngOnInit(): void {
    this.ThemeService.onInitTheme();
    this.onInitLanguage();
    this.initAOS();
  }

  initAOS() {
    AOS.init({
      duration: 850, // Animation duration in milliseconds
      once: true, // Whether animation should only happen once
      easing: 'ease-in-out', // Easing option
    });
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
