import { Injectable } from '@angular/core';
import { darkTheme } from '../../shared/themes/darkTheme';
import { lightTheme } from '../../shared/themes/lightTheme';
import { StorageService } from './storage.service';
import { localStorageEnum } from '../../shared/enums/localStorage.enum';
import { ThemeEnum } from '../../shared/enums/theme.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public readonly themes = [
    {
      key: ThemeEnum.LIGHT,
      theme: lightTheme,
    },
    {
      key: ThemeEnum.DARK,
      theme: darkTheme,
    },
  ];

  public readonly defaultTheme = this.themes[0];
  public currentTheme$: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.defaultTheme.key
  );

  constructor(private StorageService: StorageService) {}

  onInitTheme() {
    const savedThemeKey = this.StorageService.getFromLocalStorage(
      localStorageEnum.THEME
    );

    const key = savedThemeKey || this.defaultTheme.key;
    this.onUpdateTheme(key);
    this.currentTheme$.next(key);
  }

  onUpdateTheme(themeKey: string | null) {
    if (!themeKey) return;

    const themeObj = this.themes.find((theme) => theme.key === themeKey);

    if (!themeObj) return;
    const newTheme = themeObj.theme;
    Object.keys(newTheme).forEach((key) => {
      const value = (newTheme as any)[key];
      document.documentElement.style.setProperty(key, value);
    });

    this.currentTheme$.next(themeKey);
  }

  onGoToNextTheme() {
    const currentTheme = this.currentTheme$.getValue();
    const nextThemeKey =
      currentTheme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;

    this.StorageService.setToLocalStorage(localStorageEnum.THEME, nextThemeKey);
    this.onUpdateTheme(nextThemeKey);
  }

  getCurrentTheme() {
    return this.themes.find((theme) => theme.key === this.currentTheme$.value);
  }
  
}
