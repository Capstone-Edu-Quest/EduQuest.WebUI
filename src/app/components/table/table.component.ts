import {
  Component,
  Input,
  Output,
  type OnInit,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { faAngleLeft, faAngleRight, faSort } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() changePage!: EventEmitter<number>;
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10;
  @Output() onRowClick = new EventEmitter<any>();

  subscription$: Subscription = new Subscription();

  tempData: any[] = [];

  rightIcon = faAngleRight;
  leftIcon = faAngleLeft;

  sortedColumn: string = '';
  currentPage: number = 1;
  totalPages: (number | string)[] = [];

  switchValueKeys = {};

  sortIcon = faSort;

  ngOnInit(): void {
    this.initPagination();

    this.tempData = [...this.data];

    this.columns.forEach((col) => {
      if (col.isSwitchData) {
        const values = this.getAllDataByLabel(col);

        this.switchValueKeys = {
          ...this.switchValueKeys,
          [col.key]: {
            values,
            currentKey: values[0],
          },
        };
      }
    });

    if (!this.changePage) return;
    this.subscription$ = this.changePage.subscribe((pageNumber) => {
      const max = Math.ceil(this.tempData.length / this.itemsPerPage);

      if (pageNumber === -1) {
        this.currentPage = max;
        return;
      }

      if (pageNumber <= max) {
        this.currentPage = pageNumber;
      }
    });
  }

  getAllDataByLabel(column: TableColumn) {
    const vals: any[] = [];

    this.tempData.forEach((row) => {
      if (column.translateLabel) {
        vals.push(
          column.translateLabel instanceof Function
            ? column.translateLabel(row)
            : column.translateLabel
        );
        return;
      }
      vals.push(this.onGetVal(column, row));
    });

    return ['LABEL.ALL', ...new Set(vals)];
  }

  initPagination() {
    const totalPage = Math.ceil(this.tempData.length / this.itemsPerPage);
    if (totalPage <= 5) {
      this.totalPages = Array(totalPage)
        .fill(0)
        .map((_, i) => i + 1);

      return;
    }

    if (this.currentPage >= 3 && this.currentPage <= totalPage - 3) {
      this.totalPages = [
        1,
        '...',
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        '...',
        totalPage,
      ];
      return;
    }

    if (this.currentPage < 3) {
      this.totalPages = [1, 2, 3, '...', totalPage - 1, totalPage];
      return;
    }

    if (this.currentPage <= totalPage - 2) {
      this.totalPages = [
        1,
        '...',
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage,
      ];
      return;
    }

    if (this.currentPage > totalPage - 2) {
      this.totalPages = [1, 2, '...', totalPage - 2, totalPage - 1, totalPage];
      return;
    }
  }

  onGetDataStyle(column: TableColumn, row: any) {
    if (!column.style) return {};

    if (column.style instanceof Function) {
      return column.style(row);
    }

    return column.style;
  }

  onGetDataRow() {
    return this.tempData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onGetColLabel(column: TableColumn, row: any) {
    if (!column.translateLabel) return '';

    if (column.translateLabel instanceof Function) {
      return column.translateLabel(row);
    }

    return column.translateLabel;
  }

  onGetVal(column: TableColumn, row: any) {
    let value = null;

    if (column.render) {
      value = column.render(row);
    } else {
      value = row[column.key];
    }

    if (typeof value === 'object') {
      return value;
    }

    if (column.translateLabel) {
      return { value };
    }

    return value;
  }

  onModifyPage(pageNumber: number | string) {
    if (typeof pageNumber === 'string') return;
    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(this.tempData.length / this.itemsPerPage)
    ) {
      return;
    }

    this.currentPage = pageNumber;
    this.initPagination();
  }

  handleRowClick(row: any) {
    this.onRowClick.next(row);
  }

  handleClick(col: TableColumn, row: any) {
    if (col.onClick) {
      col.onClick(row);
    }
  }

  onGetClass(col: TableColumn, row: any) {
    if (!col.customClass) return '';
    if (col.customClass instanceof Function) {
      return col.customClass(row);
    }

    return col.customClass;
  }

  onSwitchKey(col: TableColumn) {
    // Prepare key & refer item
    const _k = col.key as keyof typeof this.switchValueKeys;
    const currentItem = this.switchValueKeys[_k] as any;

    // Update key
    const idx = currentItem.values.indexOf(currentItem.currentKey);
    let newKeyIdx = idx === currentItem.values.length - 1 ? 0 : idx + 1;
    currentItem.currentKey = currentItem.values[newKeyIdx];

    // Update data
    if (currentItem.currentKey === 'LABEL.ALL') {
      this.tempData = [...this.data];
    } else {
      this.tempData = this.data.filter((row) => {
        const checkVal =
          col.translateLabel instanceof Function
            ? col.translateLabel(row)
            : col.translateLabel;
        return checkVal === currentItem.currentKey;
      });
    }
  }

  onGetCurrentKeyLabel(col: TableColumn) {
    const _k = col.key as keyof typeof this.switchValueKeys;
    return (this.switchValueKeys[_k] as any).currentKey;
  }

  onGetCurrentKeyValues(col: TableColumn) {
    const _k = col.key as keyof typeof this.switchValueKeys;
    return (this.switchValueKeys[_k] as any).values;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
