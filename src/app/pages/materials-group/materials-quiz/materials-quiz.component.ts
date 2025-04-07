import { Component, OnDestroy, type OnInit } from '@angular/core';
import {
  faPen,
  faPlus,
  faQuestion,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { IMaterial, IMaterialResponse, IQuiz } from '../../../shared/interfaces/course.interfaces';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-materials-quiz',
  templateUrl: './materials-quiz.component.html',
  styleUrl: './materials-quiz.component.scss',
})
export class MaterialsQuizComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  clockIcon = faClock;
  questionIcon = faQuestion;

  constructor(private router: Router, private course: CoursesService) {}

  materials: IMaterialResponse | null = null;

  ngOnInit(): void {
    this.listenToMaterialsList();
  }

  listenToMaterialsList() {
    this.subscription$.add(
      this.course.myMaterials$.subscribe((materials) => {
        this.materials = materials;
      })
    );
  }

  onCreate() {
    this.router.navigate(['materials', 'quiz', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'quiz', id]);
  }

  onDelete(e: Event, id: string) {
    e.stopPropagation();
    this.course.deleteMaterial(id)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
