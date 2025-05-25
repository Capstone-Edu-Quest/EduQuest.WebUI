import {
  Component,
  Input,
  Output,
  type OnInit,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  ILessonOverview,
  IMaterialOverview,
  materialType,
} from '../../../shared/interfaces/course.interfaces';
import { CoursesService } from '../../../core/services/courses.service';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '@/src/app/core/services/modal.service';
import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';

@Component({
  selector: 'app-manage-stages',
  templateUrl: './manage-stages.component.html',
  styleUrl: './manage-stages.component.scss',
})
export class ManageStagesComponent implements OnInit {
  @Input('stage') lesson: ILessonOverview | null = null;
  @Input('index') index: number = 0;
  @Input('exemptLessons') exemptLessons: ILessonOverview[] = [];
  @Input('allowedToDeleteFrom') allowedToDeleteFrom: number = 0;
  @Output('onEdit') onEdit: EventEmitter<ILessonOverview | string> =
    new EventEmitter<ILessonOverview | string>();

  @ViewChild('SearchMaterials') SearchMaterialsRef!: TemplateRef<any>;

  materialsList: any[] = [];

  tempAddMaterial: any[] = [];

  searchText: string = '';

  isDropDown: boolean = true;
  XIcon = faClose;
  PlusIcon = faPlus;

  constructor(private course: CoursesService, private modal: ModalService) {}

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

    const newMaterials = this.lesson.contents.filter(
      (m) => m.id !== materialId
    );
    this.onEdit.emit({ ...this.lesson, contents: newMaterials });
  }

  onAddMaterials(material: any) {
    if(this.tempAddMaterial.findIndex(m => m.id === material.id) !== -1) return;

    this.tempAddMaterial.push(material);
  }

  onRemoveStage() {
    if (!this.lesson) return;

    this.onEdit.emit(this.lesson.id);
  }

  onGetMaterialInfo(materialId: string) {
    if (!this.course.myMaterials$.value) return;

    this.tempAddMaterial = [];

    const { assignment, document, quiz, videos } =
      this.course.myMaterials$.value;
    const allMaterials = [
      ...assignment.items,
      ...document.items,
      ...quiz.items,
      ...videos.items,
    ];

    return allMaterials.find((material) => material.id === materialId);
  }

  onPreventProp(e: Event) {
    e.stopPropagation();
  }

  onClickAddMaterial() {
    if (!this.course.myMaterials$.value) return;
    const { assignment, document, quiz, videos } =
      this.course.myMaterials$.value;
    this.materialsList = [
      ...assignment.items.map((m) => ({
        ...m,
        type: MaterialTypeEnum.ASSIGNMENT,
      })),
      ...document.items.map((m) => ({ ...m, type: MaterialTypeEnum.DOCUMENT })),
      ...quiz.items.map((m) => ({ ...m, type: MaterialTypeEnum.QUIZ })),
      ...videos.items.map((m) => ({ ...m, type: MaterialTypeEnum.VIDEO })),
    ];
    this.modal.updateModalContent(this.SearchMaterialsRef);
  }

  filterBySearch() {
    const ids = this.exemptLessons.flatMap((l) => l.contents).map(m => m.id);
    const filterList = this.materialsList
      .filter((m) =>
        m.title.toUpperCase().includes(this.searchText.toUpperCase())
      )
      .filter((m) => {
        return !ids.includes(m.id);
      });

    return filterList;
  }

  getTime(time: number) {
    return Math.ceil(time);
  }

  onCancelAdd() {
    this.modal.updateModalContent(null);
  }

  onConfirmAdd() {
    if (!this.lesson) return;

    const newMaterials = this.tempAddMaterial.map((tempMat) => {
      return {
        id: tempMat.id,
        type: tempMat.type,
        title: tempMat.title,
        description: tempMat.description,
        duration: tempMat?.duration ?? tempMat.timeLimit ?? 0,
      };
    });

    this.onEdit.emit({
      ...this.lesson,
      contents: [
        ...this.lesson.contents,
        ...newMaterials,
      ] as IMaterialOverview[],
    });
    this.tempAddMaterial = []
    this.modal.updateModalContent(null);
  }

  round(num: number) {
    return Math.ceil(num)
  }

  getOpacity(materialId: string) {
    return this.tempAddMaterial.findIndex(m => m.id === materialId) === -1 ? 1 : 0.5;
  }
}
