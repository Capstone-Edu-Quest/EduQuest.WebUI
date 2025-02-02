import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  animations: [fadeInOutAnimation]
})
export class TermsComponent implements OnInit {
  terms = [
    {
      title: 'LABEL.USE_OF_PLATFORM',
      content: 'LABEL.USE_OF_PLATFORM_CONTENT',
    },
    {
      title: 'LABEL.CONTENT_AND_IP',
      content: 'LABEL.CONTENT_AND_IP_CONTENT',
    },
    {
      title: 'LABEL.PAYMENT_AND_SUBSCRIPTIONS',
      content: 'LABEL.PAYMENT_AND_SUBSCRIPTIONS_CONTENT',
    },
    {
      title: 'LABEL.PRIVACY_AND_DATA_PROTECTION',
      content: 'LABEL.PRIVACY_AND_DATA_PROTECTION_CONTENT',
    },
    {
      title: 'LABEL.DISCLAIMERS_AND_LIABILITY',
      content: 'LABEL.DISCLAIMERS_AND_LIABILITY_CONTENT',
    },
    {
      title: 'LABEL.TERMINATION',
      content: 'LABEL.TERMINATION_CONTENT',
    },
    {
      title: 'LABEL.CHANGES_TO_TERMS',
      content: 'LABEL.CHANGES_TO_TERMS_CONTENT',
    },
    {
      title: 'LABEL.GOVERNING_LAW',
      content: 'LABEL.GOVERNING_LAW_CONTENT',
    },
    {
      title: 'LABEL.CONTACT_US',
      content: 'LABEL.CONTACT_US_CONTENT',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
