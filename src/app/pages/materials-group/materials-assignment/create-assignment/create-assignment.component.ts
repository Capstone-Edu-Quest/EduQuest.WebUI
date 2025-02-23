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
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrl: './create-assignment.component.scss',
})
export class CreateAssignmentComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isEdit: boolean = false;
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

  constructor(private route: ActivatedRoute, private location: Location) {}

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
    console.log(this.material);
  }

  onUpdate() {}

  onCreate() {
    console.log(this.material)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
