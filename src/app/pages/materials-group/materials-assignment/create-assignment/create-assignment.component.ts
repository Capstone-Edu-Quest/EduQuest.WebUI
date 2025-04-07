import { Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IAssignment,
  ILearningMaterial,
  IMaterial,
  IMaterialCreate,
} from '../../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../../shared/enums/materials.enum';
import { faAngleLeft, faClose, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrl: './create-assignment.component.scss',
})
export class CreateAssignmentComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isEdit: boolean = false;
  isTestingAssignment: boolean = false;

  avaiableLangs = Object.values(AssignmentLanguageEnum);
  material: ILearningMaterial = {
    title: '',
    description: '',
    type: MaterialTypeEnum.ASSIGNMENT,
    assignmentRequest: {
      timeLimit: 0,
      question: '',
      answerLanguage: 'text',
      expectedAnswer: ''
    }
  };

  addIcon = faPlus;
  playIcon = faPlay;
  backIcon = faAngleLeft;
  removeIcon = faClose;

  constructor(private route: ActivatedRoute, private location: Location, private message: MessageService, private translate: TranslateService, private course: CoursesService) {}

  ngOnInit(): void {
    this.listenToRoute();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const assignmentId = params.get('assignmentId');
        this.isEdit = !!assignmentId;
        if (!!assignmentId) {
          this.onInitAssignment(assignmentId);
        }
      })
    );
  }

  onInitAssignment(id: string) {}

  onCancel() {
    this.location.back();
  }

  onValidate() {
    if(!this.material.title.trim() || !this.material.description.trim() || !this.material?.assignmentRequest?.question?.trim()) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.MISSING_FIELDS'));
      return;
    }

    return true;
  }

  onUpdate() {}

  onCreate() {
    if(!this.onValidate()) return;

    this.course.createMaterial(this.material)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
