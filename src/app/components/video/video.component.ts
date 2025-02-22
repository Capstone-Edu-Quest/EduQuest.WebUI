import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import {
  faExpand,
  faGear,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import { onAddZeroToTime } from '../../core/utils/time.utils';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  animations: [fadeInOutAnimation],
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container', { static: false })
  containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('videoElement', { static: false })
  videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar', { static: false })
  progressBarRef!: ElementRef<HTMLDivElement>;

  @Input() sources: { url: string; label: string }[] = [];
  @Input() defaultSpeed: number = 1.0;

  @Output() speedChange = new EventEmitter<number>();
  @Output() qualityChange = new EventEmitter<string>();
  @Output() progressChange = new EventEmitter<number>();
  @Output() playEvent = new EventEmitter<void>();
  @Output() pauseEvent = new EventEmitter<void>();

  private subscriptions$: Subscription = new Subscription();

  currentTime: number = 0; // seconds
  duration: number = 0; // seconds
  buffered: number = 0;
  selectedQuality: string = '';

  isSettingsOpen = false;
  isPlaying = false;
  isLoading = false;

  isFullScreen: boolean = false;
  isExpand: boolean = false;

  playbackSpeed: number = 1.0;
  availableSpeed: number[] = [0.5, 1, 1.5, 2];

  currentVolume: number = 70;
  isMuted: boolean = false;

  mouseIsMoving: boolean = false;
  mouseMovingTimeOut: any;

  tooltipX: number = 0;
  tooltipTime: string = '00:00';
  tooltipVisible: boolean = false;

  playIcon = faPlay;
  pauseIcon = faPause;
  settingIcon = faGear;
  expandIcon = faExpand;
  volumeHighIcon = faVolumeHigh;
  volumeLowIcon = faVolumeLow;
  volumeMuteIcon = faVolumeMute;

  ngOnInit(): void {
    this.selectedQuality =
      this.sources.length > 0 ? this.sources[0].label : 'Auto';
    this.playbackSpeed = this.defaultSpeed;
  }

  ngAfterViewInit() {
    const videoEl = this.videoRef.nativeElement;

    if (!videoEl) return;

    this.subscriptions$.add(
      videoEl.addEventListener('timeupdate', () => {
        this.currentTime = videoEl.currentTime;
        this.progressChange.emit(this.currentTime);
        if (this.currentTime === this.duration) {
          this.isPlaying = false;
        }
      })
    );

    this.subscriptions$.add(
      videoEl.addEventListener('loadedmetadata', () => {
        this.duration = videoEl.duration || 0;
      })
    );

    this.subscriptions$.add(
      videoEl.addEventListener('progress', () => {
        if (videoEl.buffered.length > 0) {
          this.buffered = videoEl.buffered.end(videoEl.buffered.length - 1);
        }
      })
    );

    this.subscriptions$.add(
      videoEl.addEventListener('play', () => this.playEvent.emit())
    );
    this.subscriptions$.add(
      videoEl.addEventListener('pause', () => this.pauseEvent.emit())
    );

    videoEl.volume = this.currentVolume;
    videoEl.playbackRate = this.playbackSpeed;
    this.isMuted = videoEl.muted;

    this.toggleMouseMoving();
  }

  toggleFullscreen() {
    const elem = this.containerRef.nativeElement;

    if (!this.isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    this.isFullScreen = !this.isFullScreen;
  }

  changeSpeed() {
    const currentSpeed = this.availableSpeed.findIndex(
      (speed) => speed === this.playbackSpeed
    );

    const speed =
      this.availableSpeed[
        currentSpeed === this.availableSpeed.length - 1 ? 0 : currentSpeed + 1
      ];

    this.playbackSpeed = speed;
    const videoEl = this.videoRef.nativeElement;
    if (videoEl) {
      videoEl.playbackRate = speed;
    }
    this.speedChange.emit(speed);
  }

  changeQuality(e: any) {
    if (!e.target || !e.target.value) return;

    const url: string = e.target.value;
    const label: string = e.target.options[e.target.selectedIndex].text;
    const videoEl = this.videoRef.nativeElement;
    if (!videoEl) return;

    const currentTime = videoEl.currentTime;
    const isPlaying = !videoEl.paused;

    videoEl.src = url;
    videoEl.load();
    videoEl.currentTime = currentTime;

    if (isPlaying) {
      videoEl.play();
    }

    this.selectedQuality = label;
    this.qualityChange.emit(label);
  }

  seek(event: MouseEvent) {
    const progressBar = this.progressBarRef.nativeElement;
    if (!progressBar || !this.videoRef.nativeElement) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * this.duration;

    this.videoRef.nativeElement.currentTime = seekTime;
    this.progressChange.emit(seekTime);

    const videoEl = this.videoRef.nativeElement;
    const isBuffered = this.isTimeBuffered(videoEl.currentTime);

    if (!isBuffered) {
      this.showLoading();
    }
  }

  togglePlay() {
    const videoEl = this.videoRef.nativeElement;
    if (!videoEl) return;
    this.isPlaying = !this.isPlaying;
    videoEl.paused ? videoEl.play() : videoEl.pause();
  }

  toggleMouseMoving() {
    this.mouseIsMoving = true;
    clearTimeout(this.mouseMovingTimeOut);

    this.mouseMovingTimeOut = setTimeout(() => {
      this.mouseIsMoving = false;
      clearTimeout(this.mouseMovingTimeOut);
      this.mouseMovingTimeOut = null;
    }, 1000);
  }

  showTooltip(event: MouseEvent) {
    const progressBar = this.progressBarRef.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;

    this.tooltipX = offsetX;
    const time = percentage * this.duration; // seconds
    this.tooltipTime = this.getMinuteAndSecond(time);
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  showLoading() {
    this.isLoading = true;
  }

  hideLoading() {
    this.isLoading = false;
  }

  checkBuffered() {
    const videoEl = this.videoRef.nativeElement;
    if (this.isTimeBuffered(videoEl.currentTime)) {
      this.hideLoading();
    }
  }

  isTimeBuffered(time: number): boolean {
    const videoEl = this.videoRef.nativeElement;
    for (let i = 0; i < videoEl.buffered.length; i++) {
      if (
        time >= videoEl.buffered.start(i) &&
        time <= videoEl.buffered.end(i)
      ) {
        return true;
      }
    }
    return false;
  }

  getMinuteAndSecond(seconds: number) {
    return `${onAddZeroToTime(Math.floor(seconds / 60))}:${onAddZeroToTime(
      Math.floor(seconds % 60)
    )}`;
  }

  toggleMute() {
    if (this.videoRef.nativeElement) {
      this.isMuted = !this.isMuted;
      this.videoRef.nativeElement.muted = this.isMuted;
    }
  }

  getVolumeIcon() {
    if (this.isMuted || this.currentVolume === 0) return this.volumeMuteIcon;

    if (this.currentVolume > 50) return this.volumeHighIcon;

    return this.volumeLowIcon;
  }

  onChangeVolume(val: number) {
    const videoEl = this.videoRef.nativeElement;
    this.currentVolume = val;
    videoEl.volume = this.currentVolume;
  }

  onToggleExpand() {
    if (this.isFullScreen) return;
    this.isExpand = !this.isExpand;
  }

  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }
}
