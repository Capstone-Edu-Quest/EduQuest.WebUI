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
  public readonly themes = [
    {
      key: ThemeEnum.DARK,
      theme: darkTheme,
    },
    {
      key: ThemeEnum.LIGHT,
      theme: lightTheme,
    },
  ];

  public readonly defaultTheme = this.themes[0];
  public currentTheme = this.defaultTheme;

  constructor(private StorageService: StorageService) {}

  onInitTheme() {
    const savedThemeKey = this.StorageService.getFromLocalStorage(
      localStorageEnum.THEME
    );
    this.onUpdateTheme(savedThemeKey || this.defaultTheme.key);
  }

  onUpdateTheme(themeKey: string | null) {
    if (!themeKey) return;

    const themeObj = this.themes.find(
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
