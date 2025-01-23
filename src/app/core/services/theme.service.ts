import { Injectable } from '@angular/core';
import { darkTheme } from '../../shared/themes/darkTheme';
import { lightTheme } from '../../shared/themes/lightTheme';
import { StorageService } from './storage.service';
import { localStorageEnum } from '../../shared/enums/localStorage.enum';
import { ThemeEnum } from '../../shared/enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  static readonly themes = [
    {
      key: ThemeEnum.DARK,
      theme: darkTheme,
    },
    {
      key: ThemeEnum.LIGHT,
      theme: lightTheme,
    },
  ];

  static readonly defaultTheme = ThemeService.themes[0];
  static currentTheme = ThemeService.defaultTheme;

  constructor(private StorageService: StorageService) {}

  onInitTheme() {
    const savedThemeKey = this.StorageService.getFromLocalStorage(
      localStorageEnum.THEME
    );
    this.onUpdateTheme(savedThemeKey || ThemeService.defaultTheme.key);
  }

  onUpdateTheme(themeKey: string | null) {
    if (!themeKey) return;

    const themeObj = ThemeService.themes.find(
      (theme) => theme.key === themeKey
    );

    if (!themeObj) return;
    const newTheme = themeObj.theme;
    Object.keys(newTheme).forEach((key) => {
      const value = (newTheme as any)[key];
      document.documentElement.style.setProperty(key, value);
    });
  }
}
