import { Component, type OnInit } from '@angular/core';
import {
  defaultLearningPathMode,
  learningPathModeTabs,
} from '../../shared/constants/learning-paths.constant';
import {
  ILearningPath,
  IPathTab,
} from '../../shared/interfaces/learning-path.interfaces';
import { LearningPathModeEnum } from '../../shared/enums/learning-path.enum';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { LearningPathService } from '../../core/services/learning-path.service';

@Component({
  selector: 'app-leaning-path',
  templateUrl: './leaning-path.component.html',
  styleUrl: './leaning-path.component.scss',
  animations: [fadeInOutAnimation],
})
export class LeaningPathComponent implements OnInit {
  currentViewTab: string | LearningPathModeEnum = defaultLearningPathMode;
  tabs: IPathTab[] = learningPathModeTabs;

  publicLearningPath: ILearningPath[] = [];
  myLearningPath: ILearningPath[] = [];
  enrolledLearningPath: ILearningPath[] = [];

  constructor(private learningPath: LearningPathService) {}
  ngOnInit(): void {}

  initMyLearningPath() {
    this.learningPath.getMyLearningPath().subscribe((res) => {
      if (!res?.payload) return;

      this.myLearningPath = res.payload;
    });
  }

  getLearningPathList() {
    switch (this.currentViewTab) {
      case LearningPathModeEnum.PUBLIC:
        return this.publicLearningPath;
      case LearningPathModeEnum.PRIVATE:
        return this.myLearningPath;
      case 'enrolled':
        return this.enrolledLearningPath;
      default:
        return [];
    }
  }
}
