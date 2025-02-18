import {
  Component,
  Input,
  Output,
  type OnInit,
  EventEmitter,
} from '@angular/core';
import {
  IStage,
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
  @Input('stage') stage: IStage | null = null;
  @Input('index') index: number = 0;
  @Output('onEdit') onEdit: EventEmitter<IStage | string> = new EventEmitter<
    IStage | string
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
    if (!this.stage) return;

    this.onEdit.emit({ ...this.stage, title: e.target.value });
  }

  onRemoveMaterial(materialId: string) {
    if (!this.stage) return;

    const newMission = this.stage.mission.filter((m) => m.id !== materialId);
    this.onEdit.emit({ ...this.stage, mission: newMission });
  }

  onRemoveStage() {
    if (!this.stage) return;

    this.onEdit.emit(this.stage.id);
  }

  onPreventProp(e: Event) {
    e.stopPropagation();
  }
}
