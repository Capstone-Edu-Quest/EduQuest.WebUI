import { EventEmitter, Injectable } from '@angular/core';
import { FirebaseStorageFolder } from '../../shared/enums/firebase.enum';
import { FirebaseService } from './firebase.service';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { BehaviorSubject } from 'rxjs';
import { timeStringToSeconds } from '../utils/time.utils';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { blobToBase64, splitFileToChunks } from '../utils/data.utils';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  compressingProgress$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  ffmpeg = createFFmpeg({
    log: true,
  });

  constructor(
    private firebase: FirebaseService,
    private message: MessageService,
    private translate: TranslateService,
    private http: HttpService,
    private loading: LoadingService
  ) {}

  stopCompressing() {
    this.compressingProgress$.next(null);
    this.ffmpeg.exit();
  }

  vailidateVideoFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const videoMimeTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
      ];

      const videoExtensions = [
        'mp4',
        'webm',
        'ogg',
        'avi',
        'mpeg',
        'mov',
        'mkv',
      ];

      // Check MIME type
      if (!videoMimeTypes.includes(file.type)) {
        // Check extension if MIME type is missing
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !videoExtensions.includes(fileExtension)) {
          return resolve(false);
        }
      }

      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      if (Number(fileSizeInMB) > 500) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.VIDEO_SIZE_LIMIT_REACHED')
        );
        return;
      }

      // Create a video element to check resolution
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src); // Clean up object URL
        resolve(video.videoWidth > video.videoHeight); // True if landscape
      };

      video.onerror = () => resolve(false); // Invalid video

      video.src = URL.createObjectURL(file);
    });
  }

  async compressVideo(file: File) {
    if (!this.ffmpeg.isLoaded()) {
      await this.ffmpeg.load();
    }

    let totalDuration = 0;

    this.ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    this.ffmpeg.setLogger(({ type, message }) => {
      if (!message) return;
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
      'scale=1920:-2', // Keep 1080p or upscale for better quality
      '-c:v',
      'libx264',
      '-preset',
      'medium', // Better balance between speed & quality
      '-crf',
      '22', // Lower CRF = Higher quality (default is ~23)
      '-b:v',
      '4M', // Increase bitrate for smoother frames
      '-maxrate',
      '5M',
      '-bufsize',
      '10M',
      '-r',
      '30', // Keep standard FPS to avoid choppy frames
      '-c:a',
      'aac',
      '-b:a',
      '160k', // Higher bitrate for clearer sound
      '-ar',
      '44100', // Standard audio sample rate
      '-movflags',
      'faststart',
      '-threads',
      navigator.hardwareConcurrency.toString(),
      'output.mp4'
    );

    const data = this.ffmpeg.FS('readFile', 'output.mp4');
    const compressedFile = new File([data.buffer], 'compressed.mp4', {
      type: 'video/mp4',
    });

    return compressedFile;
  }

  uploadVideo(file: File) {
    let count = 0;
    const uploadingChunks = splitFileToChunks(file);
    const uploadUrl$: EventEmitter<string> = new EventEmitter<string>();

    this.loading.updateProgress(0);
    
    uploadingChunks.forEach((chunkData, index) => {
      const formData = new FormData();
      formData.append('totalChunks', String(chunkData.totalChunks));
      formData.append('chunkIndex', String(chunkData.chunkIndex));
      formData.append('fileId', chunkData.fileId);
      formData.append('chunk', chunkData.chunk);

      this.http
        .upload<{ url: string | null }>(endPoints.uploadVideo, formData)
        .subscribe((res) => {
          if (res?.isError || !res) return;

          this.loading.updateProgress(
            Math.round((count / uploadingChunks.length) * 100)
          );
          if (res.payload?.url) {
            uploadUrl$.emit(res.payload.url);
            this.loading.updateProgress(null);
          }

          count++;
        });
    });

    return uploadUrl$;
  }
}
