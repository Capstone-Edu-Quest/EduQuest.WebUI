import { Component, OnDestroy, type OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WebRole } from '../../shared/enums/user.enum';
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';
import { SubscribtionNameEnum } from '../../shared/enums/others.enum';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isInstructor = false;
  isViewMonthly = true;

  packagePrice: any = null;
  featuresDescriptionValues: any = null;

  switchValues: { key: number | string; label: string }[] = [
    { key: 1, label: 'LABEL.MONTHLY' },
    { key: 2, label: 'LABEL.YEARLY' },
  ];

  lightningIcon = faBoltLightning;

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initSubscription();
  }

  onValueChange(value: number | string): void {
    this.isViewMonthly = value === 1;
  }

  listenToUser() {
    this.subscription$ = this.user.user$.subscribe((user) => {
      if (user) {
        this.isInstructor = user.roleId === WebRole.INSTRUCTOR;
      }
    });
  }

  initSubscription() {
    this.user.getSubscriptions().subscribe((res) => {
      if (!res?.payload) return;

      this.packagePrice = res.payload.find(
        (p) => p.name === SubscribtionNameEnum.PRICE
      )?.data;

      this.featuresDescriptionValues = res.payload.find(
        (p) => p.name === SubscribtionNameEnum.NUMBERS
      )?.data;
    });
  }

  getPackageInfo(type: 'free' | 'premium') {
    const currentView = this.isViewMonthly ? 'monthly' : 'yearly';

    switch (type) {
      case 'free':
        return {
          packageName: 'LABEL.FREE_PACKAGE',
          price: 0,
          packageTime: 'LABEL.FOREVER',
          action: 'LABEL.APPLIED',
          packageDescribe: 'LABEL.FREE_PACKAGE_DESCRIBE_TEXT',
          packageDescribeValue: this.isInstructor
            ? this.featuresDescriptionValues.Instructor.free
            : this.featuresDescriptionValues.Learner.free,
          features: this.isInstructor
            ? 'LABEL.FREE_INSTRUCTOR_DESCRIPTION'
            : 'LABEL.FREE_LEARNER_DESCRIPTION',
        };
      case 'premium':
        return {
          packageName: 'LABEL.PREMIUM_PACKAGE',
          price: this.isInstructor
            ? this.packagePrice.Instructor[currentView]
            : this.packagePrice.Learner[currentView],
          packageTime: this.isViewMonthly ? 'LABEL.MONTHLY' : 'LABEL.YEARLY',
          action: this.user.user$.value?.isPremium
            ? 'LABEL.APPLIED'
            : 'LABEL.UPGRADE',
          packageDescribe: 'LABEL.PREMIUM_PACKAGE_DESCRIBE_TEXT',
          packageDescribeValue: this.isInstructor
            ? this.featuresDescriptionValues.Instructor.pro
            : this.featuresDescriptionValues.Learner.pro,
          features: this.isInstructor
            ? 'LABEL.PREMIUM_INSTRUCTOR_DESCRIPTION'
            : 'LABEL.PREMIUM_LEARNER_DESCRIPTION',
        };
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
