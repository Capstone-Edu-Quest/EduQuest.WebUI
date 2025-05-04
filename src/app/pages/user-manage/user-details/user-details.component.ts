import { CoursesService } from '@/src/app/core/services/courses.service';
import { ModalService } from '@/src/app/core/services/modal.service';
import { UserService } from '@/src/app/core/services/user.service';
import { TagTypeRequestEnum } from '@/src/app/shared/enums/course.enum';
import { ITag } from '@/src/app/shared/interfaces/course.interfaces';
import { ISearchUserRes } from '@/src/app/shared/interfaces/user.interfaces';
import { Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  @Input('currentViewUser') currentViewUser: ISearchUserRes | null = null;

  tags: ITag[] = [];
  selectedTags: string[] = [];
  isChanged: boolean = false;
  timeOut: any = null;

  constructor(
    private course: CoursesService,
    private modal: ModalService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.initTags();
    this.isChanged = false;
    this.selectedTags = [];
    this.currentViewUser?.tags?.forEach((tag) => {
      this.selectedTags.push(tag.tagId);
    });
  }

  initTags() {
    this.course
      .onGetTags({ type: TagTypeRequestEnum.SUBJECT })
      .subscribe((res) => (this.tags = res?.payload ?? []));
  }

  onChange() {
    this.isChanged = true;
  }

  onSave() {
    if (!this.currentViewUser) return;

    this.user.updateUserInfo({
      id: this.currentViewUser.id,
      username: this.currentViewUser.username,
      phone: this.currentViewUser.phone,
      headline: this.currentViewUser.headline ?? '',
      description: this.currentViewUser.description ?? '',
      tags: this.selectedTags,
    });
  }

  onCancel() {
    this.modal.updateModalContent(null);
  }
}
