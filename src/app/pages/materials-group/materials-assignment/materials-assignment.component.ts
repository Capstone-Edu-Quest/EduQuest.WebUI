import { Component, OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCode,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  IAssignment,
  IMaterial,
  IMaterialResponse,
} from '../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../shared/enums/materials.enum';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materials-assignment',
  templateUrl: './materials-assignment.component.html',
  styleUrl: './materials-assignment.component.scss',
})
export class MaterialsAssignmentComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  codeIcon = faCode;

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
    this.router.navigate(['materials', 'assignment', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'assignment', id]);
  }

  onDelete(e: Event, id: string) {
    e.stopPropagation();
    this.course.deleteMaterial(id)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
