import { Component, Input, type OnInit } from '@angular/core';
import { TableColumn } from '../../shared/interfaces/others.interfaces';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 10;

  rightIcon = faAngleRight;
  leftIcon = faAngleLeft;

  sortedColumn: string = '';
  currentPage: number = 1;
  totalPages: (number | string)[] = [];

  ngOnInit(): void {
    this.initPagination();
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

    console.log(this.currentPage, totalPage);
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

  onGetDataRow() {
    return this.data.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onGetVal(column: TableColumn, row: any) {
    const val = column.render
      ? column.render(row[column.key])
      : row[column.key];

    return val;
  }

  onModifyPage(pageNumber: number | string) {
    console.log(pageNumber);
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
}
