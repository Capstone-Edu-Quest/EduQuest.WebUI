import { Component, OnDestroy, type OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WebRole } from '../../shared/enums/user.enum';
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isInstructor = false;
  isViewMonthly = true;

  packagePrice = {
    instructor: {
      monthly: 10,
      yearly: 95,
    },
    learner: {
      monthly: 5,
      yearly: 50,
    },
  }

  featuresDescriptionValues = {
    instructor: {
      free: {
        commisionFee: 18 // %
      },
      pro: {
        commisionFee: 12, // %
        marketingEmailPerMonth: 3,
      }
    },
    learner: {
      free: {},
      pro: {
        couponPerMonth: 3,
        couponDiscountUpto: 90, // %
        extraGoldAndExp: 10, // %
        trialCoursePercentage: 15, // %
        courseTrialPerMonth: 5
      }
    }
  }

  switchValues: {key: number | string, label: string}[] = [
    {key: 1, label: 'LABEL.MONTHLY'},
    {key: 2, label: 'LABEL.YEARLY'}
  ]

  lightningIcon = faBoltLightning;

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
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
          packageDescribeValue: this.isInstructor ? this.featuresDescriptionValues.instructor.free : this.featuresDescriptionValues.learner.free,
          features: this.isInstructor ? 'LABEL.FREE_INSTRUCTOR_DESCRIPTION' : 'LABEL.FREE_LEARNER_DESCRIPTION'
        }
      case 'premium':
        return {
          packageName: 'LABEL.PREMIUM_PACKAGE',
          price: this.isInstructor ? this.packagePrice.instructor[currentView] : this.packagePrice.learner[currentView],
          packageTime: this.isViewMonthly ? 'LABEL.MONTHLY' : 'LABEL.YEARLY',
          action: this.user.user$.value?.isPremium ? 'LABEL.APPLIED' : 'LABEL.UPGRADE',
          packageDescribe: 'LABEL.PREMIUM_PACKAGE_DESCRIBE_TEXT',
          packageDescribeValue: this.isInstructor ? this.featuresDescriptionValues.instructor.pro : this.featuresDescriptionValues.learner.pro,
          features: this.isInstructor ? 'LABEL.PREMIUM_INSTRUCTOR_DESCRIPTION' : 'LABEL.PREMIUM_LEARNER_DESCRIPTION'
        }
    }
  }


  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
