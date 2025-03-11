import {
  Component,
  Input,
  Output,
  type OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() changePage!: EventEmitter<number>;
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10;
  @Output() onRowClick = new EventEmitter<any>();

  subscription$: Subscription = new Subscription();

  rightIcon = faAngleRight;
  leftIcon = faAngleLeft;

  sortedColumn: string = '';
  currentPage: number = 1;
  totalPages: (number | string)[] = [];

  ngOnInit(): void {
    this.initPagination();
    this.subscription$ = this.changePage.subscribe((pageNumber) => {
      const max = Math.ceil(this.data.length / this.itemsPerPage);
      
      if (pageNumber === -1) {
        this.currentPage = max;
        return;
      }

      if (pageNumber <= max) {
        this.currentPage = pageNumber;
      }
    });
  }

  initPagination() {
    const totalPage = Math.ceil(this.data.length / this.itemsPerPage);
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
    return this.data.slice(
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
    const val = column.render ? column.render(row) : row[column.key];

    return val;
  }

  onModifyPage(pageNumber: number | string) {
    if (typeof pageNumber === 'string') return;
    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(this.data.length / this.itemsPerPage)
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
    if(!col.customClass) return '';
    if(col.customClass instanceof Function) {
      return col.customClass(row);
    }

    return col.customClass;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
