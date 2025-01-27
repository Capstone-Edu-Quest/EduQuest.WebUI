import { Directive, OnDestroy, OnInit } from '@angular/core';

@Directive()
export class BaseComponent implements OnInit, OnDestroy {
  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  onInit(): void {}
  onDestroy(): void {}
}
