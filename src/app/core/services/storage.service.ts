import { Injectable } from '@angular/core';
import { localStorageEnum } from '../../shared/enums/localStorage.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getFromLocalStorage(key: localStorageEnum) {
    return localStorage.getItem(key);
  }

  setToLocalStorage(key: localStorageEnum, value: string) {
    localStorage.setItem(key, value);
  }
}
