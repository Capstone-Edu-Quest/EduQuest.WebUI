import { Component, ViewChild, type OnInit, TemplateRef } from '@angular/core';
import { IShopItemEdit } from '../../../shared/interfaces/three.interfaces';
import { folderPath } from '../../../shared/constants/path.constant';
import {
  faCoins,
  faMinus,
  faPen,
  faPlus,
  faRotateLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FoxItems } from '../../../components/fox-3d/3d-setup/fox-3d.config';
import { ModalService } from '../../../core/services/modal.service';
import { MessageService } from '../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { PlatformService } from '@/src/app/core/services/platform.service';
import { v4 } from 'uuid';
import { IUpdateShopItem } from '@/src/app/shared/interfaces/others.interfaces';

@Component({
  selector: 'app-shop-settings',
  templateUrl: './shop-settings.component.html',
  styleUrl: './shop-settings.component.scss',
})
export class ShopSettingsComponent implements OnInit {
  @ViewChild('addItemModal') addItemModalRef!: TemplateRef<any>;

  coinIcon = faCoins;
  addIcon = faPlus;
  removeIcon = faTrash;
  editIcon = faPen;
  recoverIcon = faRotateLeft;

  thumbnailPath = folderPath.itemThumbnail;

  isEdit: boolean = false;

  availableItemsToAdd: IShopItemEdit[] = [];
  selectedIdToAddItems: string[] = [];

  items: IShopItemEdit[] = [];

  tempItems: IShopItemEdit[] = [];

  deleteItems: string[] = [];

  constructor(
    private modal: ModalService,
    private message: MessageService,
    private translate: TranslateService,
    private platform: PlatformService
  ) {}

  ngOnInit(): void {
    this.onInitItems();
  }

  onInitItems() {
    this.platform.getShopItems().subscribe((res) => {
      if (!res?.payload) return;

      this.items = res.payload;
    });
  }

  onAdd() {
    const searchList = this.isEdit ? this.tempItems : this.items;
    this.availableItemsToAdd = [];

    FoxItems.forEach((_i) => {
      const idx = searchList.findIndex((item) => item.name === _i.id);

      if (idx === -1) {
        this.availableItemsToAdd.push({ id: v4(), name: _i.id, price: 0 });
      }
    });

    this.modal.updateModalContent(this.addItemModalRef);
  }

  onSelectToAdd(id: string) {
    const idx = this.selectedIdToAddItems.findIndex((i) => i === id);

    if (idx === -1) {
      this.selectedIdToAddItems.push(id);
      return;
    }

    this.selectedIdToAddItems.splice(idx, 1);
  }

  onCancelAdd() {
    this.modal.updateModalContent(null);
    this.selectedIdToAddItems = [];
  }

  onConfirmAdd() {
    if (this.selectedIdToAddItems.length === 0) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.NO_ITEM_TO_ADD')
      );
      return;
    }

    !this.isEdit && this.onEdit();
    this.tempItems.push(
      ...this.selectedIdToAddItems.map((name) => ({ id: v4(), name, price: 0 }))
    );
    this.modal.updateModalContent(null);
    this.selectedIdToAddItems = [];
  }

  onEdit() {
    this.deleteItems = [];
    this.isEdit = !this.isEdit;
    this.tempItems = this.isEdit ? JSON.parse(JSON.stringify(this.items)) : [];
  }

  onSave() {
    const changeItems: string[] = [];

    this.tempItems.forEach((item, i) => {
      if (item?.price !== this.items[i]?.price) {
        changeItems.push(item.id);
      }
    });

    this.items = this.tempItems.filter(
      (item) => !this.deleteItems.includes(item.id)
    );

    this.deleteItems = [];
    this.isEdit = false;

    const updatedData: IUpdateShopItem = {
      items: this.items.map((item) => ({ name: item.name, price: item.price })),
    };

    this.platform.updateShopItems(updatedData).subscribe((res) => {
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );
    });
  }

  onDelete(item: IShopItemEdit) {
    const itemIdx = this.deleteItems.findIndex((i) => i === item.id);

    if (itemIdx === -1) {
      this.deleteItems.push(item.id);
      return;
    }

    this.deleteItems.splice(itemIdx, 1);
  }
}
