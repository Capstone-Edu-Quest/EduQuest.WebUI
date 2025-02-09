import {
  Component,
  OnDestroy,
  ViewChild,
  type OnInit,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-my-course-add',
  templateUrl: './my-course-add.component.html',
  styleUrl: './my-course-add.component.scss',
})
export class MyCourseAddComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  subscription$: Subscription = new Subscription();

  cameraIcon = faCamera;
  isEdit: boolean = false;
  isDragOverImgInput: boolean = false;
  courseId!: string | null;

  constructor(
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private ImageService: ImageService
  ) {}
  ngOnInit(): void {
    this.initView();
  }

  initView() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const courseId = params.get('courseId');
        this.courseId = courseId;
        this.isEdit = Boolean(courseId);
      })
    );
  }

  onClickAddImage() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.onHandleFile(event.dataTransfer?.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragOverImgInput = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOverImgInput = false;
    this.onHandleFile(event.dataTransfer?.files);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();

    this.isDragOverImgInput = false;
  }

  onHandleFile(files: FileList | undefined) {
    if (!files) return;

    if (files.length > 1) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.ONLY_1_FILE')
      );
      return;
    }

    const file = files[0];
    const isValid = this.ImageService.validateImage(file);

    if (!isValid) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_IMAGE')
      );
      return;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
