import { Component, OnDestroy, type OnInit } from '@angular/core';
import {
  IDocument,
  IMaterial,
  IMaterialResponse,
} from '../../../shared/interfaces/course.interfaces';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-materials-document',
  templateUrl: './materials-document.component.html',
  styleUrl: './materials-document.component.scss',
})
export class MaterialsDocumentComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;

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
    this.router.navigate(['materials', 'document', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'document', id]);
  }

  onDelete(e: Event, id: string) {
    e.stopPropagation();
    this.course.deleteMaterial(id)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
