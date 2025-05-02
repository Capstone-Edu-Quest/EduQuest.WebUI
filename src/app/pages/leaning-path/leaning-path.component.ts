import { Component, OnDestroy, type OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaning-path',
  templateUrl: './leaning-path.component.html',
  styleUrl: './leaning-path.component.scss',
  animations: [fadeInOutAnimation],
})
export class LeaningPathComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  currentViewTab: string | LearningPathModeEnum = defaultLearningPathMode;
  tabs: IPathTab[] = learningPathModeTabs;

  publicLearningPath: ILearningPath[] = [];
  myLearningPath: ILearningPath[] = [];
  enrolledLearningPath: ILearningPath[] = [];

  constructor(private learningPath: LearningPathService) {}
  ngOnInit(): void {
    this.listenToMylearningPath();
  }

  listenToMylearningPath() {
    this.subscription$.add(
      this.learningPath.myLearningPaths$.subscribe(
        (l) => (this.myLearningPath = l)
      )
    );
  }

  initPublicLearningPath() {
    this.learningPath.getPublicLearningPath().subscribe((res) => {
      if (!res?.payload) return;
      this.publicLearningPath = res.payload;
    });
  }

  initEnrolledLearningPath() {
    this.learningPath
      .getMyLearningPath({ isEnrolled: true })
      .subscribe((res) => {
        this.enrolledLearningPath = res?.payload ?? [];
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

  onChangeTab(newTab: any) {
    this.currentViewTab = newTab;
    switch (this.currentViewTab) {
      case LearningPathModeEnum.PUBLIC:
        this.initPublicLearningPath();
        return;
      case LearningPathModeEnum.PRIVATE:
        return;
      case 'enrolled':
        this.initEnrolledLearningPath();
        return;
      default:
        return [];
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
