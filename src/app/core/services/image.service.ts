import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  validateImage(file: File): boolean {
    if (file.type.match(/image\/*/) == null) {
      return false;
    }
    return true;
  }

}
