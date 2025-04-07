import {
  Component,
  ViewChild,
  type OnInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  IDocument,
  ILearningMaterial,
  IMaterial,
  IMaterialCreate,
} from '../../../../shared/interfaces/course.interfaces';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('textEditor') textEditor!: ElementRef;

  subscription$ = new Subscription();

  isEdit: boolean = false;

  material: ILearningMaterial = {
    title: '',
    description: '',
    type: MaterialTypeEnum.DOCUMENT,
    content: ' ',
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private message: MessageService,
    private translate: TranslateService,
    private course: CoursesService
  ) {}

  ngOnInit(): void {
    this.listenToRoute();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const documentId = params.get('documentId');
        this.isEdit = !!documentId;
        if (!!documentId) {
          this.onInitDocument(documentId);
        }
      })
    );
  }

  onInitDocument(docId: string) {
    this.course.getMaterialById(docId).subscribe((res) => {
      if (!res?.payload) return;

      this.material = res.payload;
    });
  }

  onCancel() {
    this.location.back();
  }

  onUpdate() {
    this.material.content = (this.textEditor as any).htmlContent;
    console.log(this.material);
  }

  onCreate() {
    this.material.content = (this.textEditor as any).htmlContent;

    if (
      this.material.title.trim() === '' ||
      this.material.description.trim() === ''
    ) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.MISSING_FIELDS')
      );
      return;
    }

    this.course.createMaterial(this.material)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
