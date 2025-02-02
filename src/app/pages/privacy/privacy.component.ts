import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  privacies = [
    {
      title: 'LABEL.PRIVACY_POLICY',
      content: 'LABEL.PRIVACY_POLICY_CONTENT',
    },
    {
      title: 'LABEL.DATA_WE_COLLECT',
      content: 'LABEL.DATA_WE_COLLECT_CONTENT',
    },
    {
      title: 'LABEL.HOW_WE_USE_YOUR_DATA',
      content: 'LABEL.HOW_WE_USE_YOUR_DATA_CONTENT',
    },
    {
      title: 'LABEL.DATA_SHARING_AND_THIRD_PARTY_SERVICES',
      content: 'LABEL.DATA_SHARING_AND_THIRD_PARTY_SERVICES_CONTENT',
    },
    {
      title: 'LABEL.DATA_SECURITY',
      content: 'LABEL.DATA_SECURITY_CONTENT',
    },
    {
      title: 'LABEL.YOUR_RIGHTS_AND_CHOICES',
      content: 'LABEL.YOUR_RIGHTS_AND_CHOICES_CONTENT',
    },
    {
      title: 'LABEL.RETENTION_OF_DATA',
      content: 'LABEL.RETENTION_OF_DATA_CONTENT',
    },
    {
      title: 'LABEL.CHANGES_TO_POLICY',
      content: 'LABEL.CHANGES_TO_POLICY_CONTENT',
    },
    {
      title: 'LABEL.CONTACT_US',
      content: 'LABEL.CONTACT_US_CONTENT',
    },
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
  ];
  constructor() {}

  ngOnInit() {}
}
