import { Component, ElementRef, ViewChild, type OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import {
  faFile,
  faTrash,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  IBecomeInstructorReq,
  IInstructorApplyRes,
} from '../../shared/interfaces/others.interfaces';
import { PlatformService } from '../../core/services/platform.service';
import { UserService } from '../../core/services/user.service';
import { CoursesService } from '../../core/services/courses.service';
import { TagTypeRequestEnum } from '../../shared/enums/course.enum';
import { ITag } from '../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-become-instructor',
  templateUrl: './become-instructor.component.html',
  styleUrl: './become-instructor.component.scss',
})
export class BecomeInstructorComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  acceptedFilesType = ['application/pdf', 'image/jpeg', 'image/png'];
  myApplicant: IInstructorApplyRes | null = null;

  maxFiles: number = 5;
  isDragOverInput: boolean = false;
  instructorParam: IBecomeInstructorReq = {
    UserId: '',
    Headline: '',
    Description: '',
    Phone: '',
    Tag: [],
    CertificateFiles: [],
  };

  tags: ITag[] = [];

  fileIcon = faFile;
  deleteIcon = faTrash;
  exploreIcon = faUpRightFromSquare;

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private platform: PlatformService,
    private user: UserService,
    private course: CoursesService
  ) {}
  ngOnInit(): void {
    this.initMyApplicant();
    this.initTags();
  }

  initMyApplicant() {
    this.platform.getMyInstructorApplicant().subscribe((res) => {
      this.myApplicant = res?.payload ?? null;
    });
  }

  initTags() {
    this.course
      .onGetTags({ type: TagTypeRequestEnum.SUBJECT })
      .subscribe((res) => (this.tags = res?.payload ?? []));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragOverInput = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOverInput = false;
    this.onHandleFile(event.dataTransfer?.files);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();

    this.isDragOverInput = false;
  }

  onFileSelected(event: any) {
    this.onHandleFile(event.target.files);
  }

  onClickAddFile() {
    this.fileInputRef?.nativeElement?.click();
  }

  onRemoveFile(index: number) {
    this.instructorParam.CertificateFiles =
      this.instructorParam.CertificateFiles.filter((_, i) => i !== index);
  }

  viewCertificate(url: string) {
    window.open(url, '_blank');
  }

  async onHandleFile(files: FileList | undefined) {
    if (!files) return;

    const certiFiles = Object.entries(files)
      .map(([k, f]) => f)
      .filter((f) => this.acceptedFilesType.includes(f.type));

    const submittedFiles = [
      ...this.instructorParam.CertificateFiles,
      ...certiFiles,
    ];

    const fileMap = new Map<string, File>();
    for (const file of submittedFiles) {
      const key = `${file.name}-${file.size}`;
      fileMap.set(key, file);
    }

    this.instructorParam.CertificateFiles = Array.from(fileMap.values()).slice(
      0,
      this.maxFiles
    );
  }

  onValidate() {
    const errors: string[] = [];

    if (
      this.instructorParam.Headline.trim().length < 20 ||
      this.instructorParam.Headline.trim().length > 50
    ) {
      errors.push('MESSAGE.ERROR_HEADLINE');
    }

    if (
      this.instructorParam.Description.trim().length < 40 ||
      this.instructorParam.Description.trim().length > 200
    ) {
      errors.push('MESSAGE.ERROR_DESCRIPTION');
    }

    const phoneRegex = /^[0-9]{9,15}$/; // simple validation
    if (!phoneRegex.test(this.instructorParam.Phone.trim())) {
      errors.push('MESSAGE.ERROR_PHONE');
    }

    if (
      !this.instructorParam.CertificateFiles ||
      this.instructorParam.CertificateFiles.length === 0
    ) {
      errors.push('MESSAGE.ERROR_FILES');
    }

    return errors;
  }

  onSubmit() {
    if (this.instructorParam.Tag.length === 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.AT_LEAST_1_SUBJECT')
      );
      return;
    }
    const errs = this.onValidate();
    if (errs.length > 0) {
      errs.forEach((err) =>
        this.message.addMessage('error', this.translate.instant(err))
      );
      return;
    }

    if (!this.user.user$.value?.id) return;
    this.instructorParam.UserId = this.user.user$.value?.id;

    this.platform
      .applyBecomeInstructor(this.instructorParam)
      .subscribe((res) => {
        if (!res?.payload) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.FAILED_SUBMIT')
          );
          return;
        }

        this.myApplicant = res.payload;
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.SUBMITTED_SUCCESSFULLY')
        );
      });
  }

  onCancel() {
    this.platform.cancelInstructorRegistration().subscribe((res) => {
      if (!res?.payload) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.FAILED_CANCEL')
        );
        return;
      }

      this.myApplicant = null;
      this.instructorParam = {
        UserId: '',
        Headline: '',
        Description: '',
        Phone: '',
        Tag: [],
        CertificateFiles: [],
      };
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.CANCEL_SUCCESSFULLY')
      );
    });
  }
}
