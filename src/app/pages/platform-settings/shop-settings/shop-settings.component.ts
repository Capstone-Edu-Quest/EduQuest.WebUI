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

  items: IShopItemEdit[] = [
    {
      id: 'orange-vest',
      price: 5,
    },
    {
      id: 'wings',
      price: 30,
    },
    {
      id: 'police-vest',
      price: 25,
    },
    {
      id: 'leather-vest',
      price: 12,
    },
    {
      id: 'donut-necklace',
      price: 12,
    },
    {
      id: 'cow-boy-hat',
      price: 30,
    },
    {
      id: 'samurai-hat',
      price: 30,
    },
    {
      id: 'clown-hat',
      price: 5,
    },
    {
      id: 'arrow-hat',
      price: 8,
    },
    {
      id: 'tinker-glasses',
      price: 18,
    },
    {
      id: 'sun-glasses',
      price: 12,
    },
    {
      id: 'bicycle-hat',
      price: 15,
    },
    {
      id: 'katana',
      price: 12,
    },
    {
      id: 'miraz-sword',
      price: 16,
    },
    {
      id: 'persian-sword',
      price: 30,
    },
    // {
    //   id: 'balloon',
    //   price: 5,
    // },
    // {
    //   id: 'goblin-shield',
    //   price: 30,
    // },
    // {
    //   id: 'apollos-shield',
    //   price: 22,
    // },
    // {
    //   id: 'gold-belt',
    //   price: 30,
    // },
  ];

  tempItems: IShopItemEdit[] = [];

  deleteItems: string[] = [];

  constructor(
    private modal: ModalService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  onAdd() {
    const searchList = this.isEdit ? this.tempItems : this.items;
    this.availableItemsToAdd = [];

    FoxItems.forEach((_i) => {
      const idx = searchList.findIndex((item) => item.id === _i.id);

      if (idx === -1) {
        this.availableItemsToAdd.push({ id: _i.id, price: 0 });
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
      ...this.selectedIdToAddItems.map((id) => ({ id, price: 0 }))
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
      if (item.price !== this.items[i].price) {
        changeItems.push(item.id);
      }
    });

    this.items = this.tempItems.filter(
      (item) => !this.deleteItems.includes(item.id)
    );

    console.log('changedItemId: ', changeItems);
    console.log('deleteItems: ', this.deleteItems);
    console.log('items: ', this.items);

    this.deleteItems = [];
    this.isEdit = false;
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
