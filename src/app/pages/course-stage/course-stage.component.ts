import {
  ICourse,
  IMaterial,
  IMaterialOverview,
  IStageMission,
} from '../../shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faClock,
  faLock,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { MissionStatus } from '../../shared/enums/course.enum';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-course-stage',
  templateUrl: './course-stage.component.html',
  styleUrl: './course-stage.component.scss',
  animations: [fadeInOutAnimation],
})
export class CourseStageComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;

  lockIcon = faLock;
  doneIcon = faCheck;
  currentIcon = faStar;
  nextIcon = faChevronRight;
  prevIcon = faChevronLeft;
  clockIcon = faClock;
  rows: any[] = [];

  totalLessons = 0;
  currentLesson = 1;

  currentMaterials: IMaterialOverview[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initMaterials();
    this.initRow();
  }

  initMaterials() {
    this.currentMaterials =
      this.courseDetails.listLesson[this.currentLesson - 1].materials;
    this.totalLessons = this.courseDetails.listLesson.length;
  }

  initRow() {
    const itemPerRow = 4;
    this.rows = Array(Math.ceil(this.currentMaterials.length / itemPerRow));

    this.currentMaterials.forEach((material, index) => {
      const row = Math.floor(index / itemPerRow);
      if (!this.rows[row]) {
        this.rows[row] = [];
      }

      this.rows[row].push({
        ...material,
        ...this.setIconToMission(material.status ?? MissionStatus.LOCKED),
      });
    });

    for (let i = this.rows[this.rows.length - 1].length; i < itemPerRow; i++) {
      this.rows[this.rows.length - 1].push(null);
    }

    console.log(this.rows)
  }

  updateCurrentStage(value: number) {
    this.currentLesson += value;
  }

  getRowLength(row: any[]) {
    let count = 0;
    row.forEach((item) => {
      if (item) {
        count++;
      }
    });

    return count;
  }

  setIconToMission(status: MissionStatus) {
    switch (status) {
      case MissionStatus.DONE:
        return {
          icon: this.doneIcon,
          class: 'done',
        };
      case MissionStatus.CURRENT:
        return {
          icon: this.currentIcon,
          class: '',
        };
      case MissionStatus.LOCKED:
      default:
        return {
          icon: this.lockIcon,
          class: 'locked',
        };
    }
  }
}
