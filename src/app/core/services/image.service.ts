import { Injectable } from '@angular/core';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { FirebaseService } from './firebase.service';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private firebase: FirebaseService, private http: HttpService) {}

  validateImage(file: File): boolean {
    if (file.type.match(/image\/*/) == null) {
      return false;
    }
    return true;
  }

  async cropImageTo16by9(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not available');

        // Original dimensions
        const { width, height } = img;

        // Calculate crop dimensions to fit 16:9
        let newWidth = width;
        let newHeight = (width * 9) / 16;

        if (newHeight > height) {
          newHeight = height;
          newWidth = (height * 16) / 9;
        }

        // Center crop area
        const startX = (width - newWidth) / 2;
        const startY = (height - newHeight) / 2;

        // Set canvas size
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw cropped image on canvas
        ctx.drawImage(
          img,
          startX,
          startY,
          newWidth,
          newHeight,
          0,
          0,
          newWidth,
          newHeight
        );

        // Convert to File
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(croppedFile); // ✅ Returning a File, not a Blob URL
            } else {
              reject('Failed to create cropped file');
            }
          },
          file.type,
          1
        );
      };

      reader.readAsDataURL(file);
    });
  }

  uploadImageToFirebaseStorage(
    folder: FirebaseStorageFolder,
    file: File,
    fileName: string
  ) {
    const filePath = `${folder}/${fileName}`;

    const { progress$, downloadURL$ } = this.firebase.uploadFile(
      filePath,
      file
    );

    return { progress$, downloadURL$ };
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('ImageFile', file);
    return this.http
      .upload<{url: string}>(endPoints.uploadImage, formData)
  }
}
