import { Component, type OnInit } from '@angular/core';
import {
  ILearningPath,
  IPathTab,
} from '../../shared/interfaces/learning-path.interfaces';
import { LearningPathModeEnum } from '../../shared/enums/learning-path.enum';
import { LearningPathService } from '../../core/services/learning-path.service';

@Component({
  selector: 'app-learning-path-manage',
  templateUrl: './learning-path-manage.component.html',
  styleUrl: './learning-path-manage.component.scss',
})
export class LearningPathManageComponent implements OnInit {
  currentViewTab: string | LearningPathModeEnum = LearningPathModeEnum.PRIVATE;
  tabs: IPathTab[] = [
    {
      label: 'LABEL.PUBLIC_PATH',
      value: LearningPathModeEnum.PUBLIC,
    },
    {
      label: 'LABEL.PRIVATE_PATH',
      value: LearningPathModeEnum.PRIVATE,
    },
  ];

  publicLearningPath: ILearningPath[] = [];
  myLearningPath: ILearningPath[] = [];

  constructor(private learningPath: LearningPathService) {}

  ngOnInit(): void {
    this.initMylearningPath();
  }

  initMylearningPath() {
    this.learningPath.getMyLearningPath().subscribe((res) => {
      this.myLearningPath = res?.payload ?? [];
    });
  }

  initPublicLearningPath() {
    this.learningPath.getPublicLearningPath().subscribe((res) => {
      if (!res?.payload) return;
      this.publicLearningPath = res.payload;
    });
  }

  initEnrolledLearningPath() {}

  getLearningPathList() {
    switch (this.currentViewTab) {
      case LearningPathModeEnum.PUBLIC:
        return this.publicLearningPath;
      case LearningPathModeEnum.PRIVATE:
        return this.myLearningPath;
      default:
        return [];
    }
  }

  onChangeTab(newTab: any) {
    this.currentViewTab = newTab;
    switch (this.currentViewTab) {
      case LearningPathModeEnum.PUBLIC:
        this.initPublicLearningPath();
        return;
      case LearningPathModeEnum.PRIVATE:
        // this.initMylearningPath();
        return;
      case 'enrolled':
        this.initEnrolledLearningPath();
        return;
      default:
        return [];
    }
  }
}
