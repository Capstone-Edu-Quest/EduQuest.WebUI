import { Injectable } from '@angular/core';
import {
  TokenEnum,
  localStorageEnum,
} from '../../shared/enums/localStorage.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getFromLocalStorage(key: localStorageEnum) {
    return localStorage.getItem(key);
  }

  setToLocalStorage(key: localStorageEnum, value: string | null) {
    if(!value) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, value);
  }

  setCookie(key: TokenEnum, value: string | null) {
    document.cookie = value
      ? `${key}=${value}; path=/;`
      : `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  getCookie(tokenId: TokenEnum) {
    const allCookies = document.cookie.split(';');
    const matchesCookie = allCookies.find((cookie) => cookie.includes(tokenId));

    return matchesCookie ? matchesCookie.split('=')[1] : null;
  }
}
