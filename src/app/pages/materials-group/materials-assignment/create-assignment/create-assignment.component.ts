import { Location } from '@angular/common';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IAssignment,
  IMaterial,
  IMaterialCreate,
} from '../../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../../shared/enums/materials.enum';
import { faAngleLeft, faClose, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from '../../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

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
  material: IMaterialCreate<IAssignment> | IMaterial<IAssignment> = {
    name: '',
    description: '',
    type: 'assignment',
    data: {
      question: '',
      answerLanguage: AssignmentLanguageEnum.TEXT,
      expectedAnswer: null,
      inputArguments: [],
    },
  };

  addIcon = faPlus;
  playIcon = faPlay;
  backIcon = faAngleLeft;
  removeIcon = faClose;

  constructor(private route: ActivatedRoute, private location: Location, private message: MessageService, private translate: TranslateService) {}

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

  onAddArgument() {
    this.material.data.inputArguments!.push('');
  }

  onCancel() {
    this.location.back();
  }

  onTestAssignment() {
    if(!this.material.data.expectedAnswer || this.material.data.expectedAnswer?.trim() === '' || this.material.data.inputArguments.length === 0 || this.material.data.inputArguments.some(arg => arg?.trim() === '')) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.NO_EXPECTED_ANSWER_OR_ARGUMENTS'));
      return;
    }

    this.isTestingAssignment = true;
  }

  trackByIdx(idx: number) {}

  onRemoveArg(idx: number) {
    this.material.data.inputArguments.splice(idx, 1);
  }

  onUpdate() {}

  onCreate() {
    console.log(this.material)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
