import { Injectable } from '@angular/core';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { FirebaseService } from './firebase.service';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { BehaviorSubject } from 'rxjs';
import { timeStringToSeconds } from '../utils/time.utils';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  compressingProgress$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  ffmpeg = createFFmpeg({ log: false });

  constructor(private firebase: FirebaseService) {}

  vailidateVideoFile(file: File): boolean {
    const videoMimeTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mpeg',
      'video/quicktime', // MOV
      'video/x-msvideo', // AVI
      'video/x-matroska', // MKV
    ];

    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mpeg', 'mov', 'mkv'];

    // Check MIME type
    if (videoMimeTypes.includes(file.type)) return true;

    // Check extension if MIME type is missing
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && videoExtensions.includes(fileExtension)) return true;

    return false;
  }

  async compressVideo(file: File) {
    if (!this.ffmpeg.isLoaded()) {
      await this.ffmpeg.load();
    }

    let totalDuration = 0;

    this.ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
    this.ffmpeg.setLogger(({ type, message }) => {
      const totalTime = message.match(/Duration:\s(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (totalTime) {
        // console.log('totalTime', totalTime[1]);
        totalDuration = timeStringToSeconds(totalTime[1]);
      }

      const currentTime = message.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (currentTime) {
        this.compressingProgress$.next(
          ((timeStringToSeconds(currentTime[1]) / totalDuration) * 100).toFixed(
            2
          )
        );
      }
    });

    await this.ffmpeg.run(
      '-i',
      'input.mp4',
      '-vf',
      'scale=1280:720',
      '-b:v',
      '1M',
      'output.mp4'
    );
    const data = this.ffmpeg.FS('readFile', 'output.mp4');
    const compressedFile = new File([data.buffer], 'compressed.mp4', {
      type: 'video/mp4',
    });

    return compressedFile;
  }

  async uploadVideoToFirebaseStorage(
    folder: FirebaseStorageFolder,
    file: File,
    fileName: string
  ) {
    this.compressingProgress$.next('0.00');
    
    const compressedFile = await this.compressVideo(file);
    const filePath = `${folder}/${fileName}`;

    this.ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    this.compressingProgress$.next(null);
    const { progress$, downloadURL$ } = this.firebase.uploadFile(
      filePath,
      compressedFile
    );

    return { progress$, downloadURL$ };
  }
}
