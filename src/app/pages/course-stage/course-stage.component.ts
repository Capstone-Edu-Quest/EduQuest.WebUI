import {
  ICourse,
  ILearningMaterial,
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
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';

@Component({
  selector: 'app-course-stage',
  templateUrl: './course-stage.component.html',
  styleUrl: './course-stage.component.scss',
  animations: [fadeInOutAnimation],
})
export class CourseStageComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;

  viewingMaterial: ILearningMaterial | null = null;

  lockIcon = faLock;
  doneIcon = faCheck;
  currentIcon = faStar;
  nextIcon = faChevronRight;
  prevIcon = faChevronLeft;
  clockIcon = faClock;
  rows: any[] = [];

  totalLessons = 0;
  currentLesson = 0;

  currentMaterials: IMaterialOverview[] = [];

  constructor(
    private route: ActivatedRoute,
    private course: CoursesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < this.courseDetails.listLesson.length; i++) {
      const currentLesson = this.courseDetails.listLesson[i].materials.some(
        (m) => m.status === MissionStatus.CURRENT
      );

      if (currentLesson) {
        this.currentLesson = this.courseDetails.listLesson[i].index;
        break;
      }
    }

    this.initMaterials();
    this.route.queryParams.subscribe((params) => {
      const materialId = params['materialId'];

      if (!materialId) {
        this.viewingMaterial = null;
        return;
      }
      this.course.getMaterialById(materialId).subscribe((res) => {
        if (!res?.payload) {
          this.viewingMaterial = null;
          return;
        }

        this.viewingMaterial = res.payload;
      });
    });
  }

  initMaterials() {
    this.currentMaterials =
      this.courseDetails.listLesson[this.currentLesson].materials;
    this.totalLessons = this.courseDetails.listLesson.length;

    this.initRow();
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
  }

  updateCurrentStage(value: number) {
    this.currentLesson += value;
    this.initMaterials();
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

  round(val: number) {
    return Math.ceil(val);
  }

  handleLessonClick(material: IMaterialOverview) {
    if (material.status === MissionStatus.LOCKED) return;
    this.router.navigate([], { queryParams: { materialId: material.id } });
  }

  onNextMaterial(currentMaterialId: string) {
    let nextLessonIndex = -1,
      nextMaterialId = null;

    for (let i = 0; i < this.courseDetails.listLesson.length; i++) {
      for (
        let z = 0;
        z < this.courseDetails.listLesson[i].materials.length;
        z++
      ) {
        const materials = this.courseDetails.listLesson[i].materials[z];
        if (materials.id === currentMaterialId) {
          this.courseDetails.listLesson[i].materials[z].status =
            MissionStatus.DONE;

          if (this.courseDetails.listLesson[i].materials[z + 1]?.id) {
            nextLessonIndex = i + 1;
            nextMaterialId =
              this.courseDetails.listLesson[i].materials[z + 1]?.id;
            this.courseDetails.listLesson[i].materials[z + 1].status =
              MissionStatus.CURRENT;
            break;
          }

          if (this.courseDetails.listLesson[i + 1]?.materials[0]?.id) {
            nextLessonIndex = i + 2;
            nextMaterialId =
              this.courseDetails.listLesson[i + 1]?.materials[0]?.id;
            this.courseDetails.listLesson[i + 1].materials[0].status =
              MissionStatus.CURRENT;
            break;
          }
        }
      }
    }

    if (nextLessonIndex === -1 || !nextMaterialId) {
      console.log('no next lesson');
      return;
    }

    this.currentLesson = nextLessonIndex;
    this.router.navigate([], { queryParams: { materialId: nextMaterialId } });
    this.initMaterials();
  }
}
