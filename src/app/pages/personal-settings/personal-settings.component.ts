import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-settings',
  templateUrl: './personal-settings.component.html',
  styleUrl: './personal-settings.component.scss',
})
export class PersonalSettingsComponent implements OnInit {

  tabs = [
    { label: 'LABEL.PASSWORD', link: 'password' },
  ];

  ngOnInit(): void { }

}
