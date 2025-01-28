import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-by-name',
  templateUrl: './avatar-by-name.component.html',
  styleUrls: ['./avatar-by-name.component.scss'],
})
export class AvatarByNameComponent implements OnInit {
  @Input('name') name: string = '';
  @Input('size') size: string = '35px';
  shortName: string = '';
  constructor() {}

  ngOnInit() {
    this.onCreateShortName();
  }

  onCreateShortName() {
    const nameArray = this.name.split(' ');
    this.shortName = nameArray[nameArray.length - 1].charAt(0);
  }
}
