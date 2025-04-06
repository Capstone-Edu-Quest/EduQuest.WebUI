import { Component, OnDestroy, type OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  IMaterial,
  IMaterialResponse,
  IVideo,
} from '../../../shared/interfaces/course.interfaces';
import { Router } from '@angular/router';
import { CoursesService } from '@/src/app/core/services/courses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materials-video',
  templateUrl: './materials-video.component.html',
  styleUrl: './materials-video.component.scss',
})
export class MaterialsVideoComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  addIcon = faPlus;
  clockIcon = faClock;
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
    this.router.navigate(['/materials/videos/new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['/materials/videos/', id]);
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
