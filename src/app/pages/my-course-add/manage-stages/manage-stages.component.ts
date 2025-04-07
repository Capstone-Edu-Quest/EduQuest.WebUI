import {
  Component,
  Input,
  Output,
  type OnInit,
  EventEmitter,
} from '@angular/core';
import {
  ICourseCreateLesson,
  ILessonOverview,
  materialType,
} from '../../../shared/interfaces/course.interfaces';
import { CoursesService } from '../../../core/services/courses.service';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-stages',
  templateUrl: './manage-stages.component.html',
  styleUrl: './manage-stages.component.scss',
})
export class ManageStagesComponent implements OnInit {
  @Input('stage') lesson: ILessonOverview | null = null;
  @Input('index') index: number = 0;
  @Output('onEdit') onEdit: EventEmitter<ILessonOverview | string> = new EventEmitter<
  ILessonOverview | string
  >();

  isDropDown: boolean = true;
  XIcon = faClose;
  PlusIcon = faPlus;

  constructor(private course: CoursesService) {}

  ngOnInit(): void {}

  onExpand() {
    this.isDropDown = !this.isDropDown;
  }

  onGetIcon(type: materialType) {
    return this.course.onGetMaterialIcon(type);
  }

  onChangeName(e: any) {
    if (!this.lesson) return;

    this.onEdit.emit({ ...this.lesson, name: e.target.value });
  }

  onRemoveMaterial(materialId: string) {
    if (!this.lesson) return;

    const newMaterials = this.lesson.materials.filter((m) => m.id !== materialId);
    this.onEdit.emit({ ...this.lesson, materials: newMaterials });
  }

  onRemoveStage() {
    if (!this.lesson) return;

    this.onEdit.emit(this.lesson.id);
  }

  onGetMaterialInfo(materialId: string) {
    if(!this.course.myMaterials$.value) return;
    const {assignment, document, quiz, videos} = this.course.myMaterials$.value;
    const allMaterials = [...assignment.items, ...document.items, ...quiz.items, ...videos.items];

    return allMaterials.find(material => material.id === materialId)
  }

  onPreventProp(e: Event) {
    e.stopPropagation();
  }
}
