import { Component, Input, OnInit } from '@angular/core';
import { IStage } from '../../../shared/interfaces/course.interfaces';
import {
  faFile,
  faCirclePlay,
  faChartBar
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.scss'],
})
export class CourseSectionComponent implements OnInit {
  @Input('stage') stage: IStage | null = null;
  @Input('index') index: number = 0;
  isDropDown: boolean = false;
  constructor() {}

  ngOnInit() {}

  onExpand() {
    this.isDropDown = !this.isDropDown;
  }

  onGetIcon(type: string) {
    switch (type) {
      case 'video':
        return faCirclePlay;
      case 'quiz':
        return faChartBar;
      case 'document':
      default:
        return faFile;
    }
  }
}
