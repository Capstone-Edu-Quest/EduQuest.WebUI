import { Component, ElementRef, ViewChild, type OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IBecomeInstructorReq } from '../../shared/interfaces/others.interfaces';
import { PlatformService } from '../../core/services/platform.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-become-instructor',
  templateUrl: './become-instructor.component.html',
  styleUrl: './become-instructor.component.scss',
})
export class BecomeInstructorComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  acceptedFilesType = ['application/pdf', 'image/jpeg', 'image/png'];

  maxFiles: number = 5;
  isDragOverInput: boolean = false;
  instructorParam: IBecomeInstructorReq = {
    UserId: '',
    Headline: '',
    Description: '',
    Phone: '',
    CertificateFiles: [],
  };

  fileIcon = faFile;
  deleteIcon = faTrash;

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private platform: PlatformService,
    private user: UserService
  ) {}
  ngOnInit(): void {}

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
        if(!res?.payload) {
          this.message.addMessage('error', this.translate.instant("MESSAGE.FAILED_SUBMIT"))
          return;
        }
        this.message.addMessage('error', this.translate.instant("MESSAGE.SUBMITTED_SUCCESSFULLY"))
        console.log(res);
      });
  }
}
