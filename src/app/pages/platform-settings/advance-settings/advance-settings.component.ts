import { Component, type OnInit } from '@angular/core';
import { WebRole } from '../../../shared/enums/user.enum';
import { PackageTypeEnum } from '../../../shared/enums/platform.enum';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { UserService } from '../../../core/services/user.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-advance-settings',
  templateUrl: './advance-settings.component.html',
  styleUrl: './advance-settings.component.scss',
})
export class AdvanceSettingsComponent implements OnInit {
  editIcon = faPen;

  APIsPackagePrice = {
    instructor: {
      monthly: 10,
      yearly: 95,
    },
    learner: {
      monthly: 5,
      yearly: 50,
    },
  };

  APIsPackageNumbers = {
    instructor: {
      free: {
        commisionFee: 18, // %
      },
      pro: {
        commisionFee: 12, // %
        marketingEmailPerMonth: 3,
      },
    },
    learner: {
      free: {},
      pro: {
        couponPerMonth: 3,
        couponDiscountUpto: 90, // %
        extraGoldAndExp: 10, // %
        trialCoursePercentage: 15, // %
        courseTrialPerMonth: 5,
      },
    },
  };

  displayPriceData: any[] = [];
  priceTableColumns: TableColumn[] = [
    {
      key: 'role',
      label: 'LABEL.PACKAGE',
      translateLabel: (data: any) =>
        this.onGetPackageLabel(data.type, data.role),
    },
    {
      key: 'monthly',
      label: 'LABEL.MONTHLY',
      isMoney: true,
    },
    {
      key: 'yearly',
      label: 'LABEL.YEARLY',
      isMoney: true,
    },
  ];

  displayBenefitsData: any[] = [];
  benefitsTableColumns: TableColumn[] = [
    {
      key: 'role',
      label: 'LABEL.PACKAGE',
      translateLabel: (data: any) =>
        this.onGetPackageLabel(data.type, data.role),
    },
    {
      key: 'key',
      label: 'LABEL.BENEFIT',
      translateLabel: (data: any) => `LABEL.${data.key.toUpperCase()}`,
    },
    {
      key: 'value',
      label: 'LABEL.VALUE',
    },
  ];

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.initPriceData();
    this.initBenefitsData();

    console.log(this.APIsPackageNumbers, this.APIsPackagePrice);
  }

  initPriceData() {
    this.displayPriceData = [];

    Object.keys(this.APIsPackagePrice).forEach((key) => {
      const _k = key.toUpperCase() as keyof typeof WebRole;
      const priceRoleKey = key as keyof typeof this.APIsPackagePrice;
      const priceData = {
        role: WebRole[_k],
        type: PackageTypeEnum.PRO,
        monthly: this.APIsPackagePrice[priceRoleKey].monthly,
        yearly: this.APIsPackagePrice[priceRoleKey].yearly,
      };

      this.displayPriceData.push(priceData);
    });
  }

  initBenefitsData() {
    const benefits: any[] = [];

    // Categorize by package
    Object.keys(this.APIsPackageNumbers).forEach((key) => {
      const _k = key.toUpperCase() as keyof typeof WebRole;
      const benefitRoleKey = key as keyof typeof this.APIsPackageNumbers;

      Object.keys(this.APIsPackageNumbers[benefitRoleKey]).forEach((_benefitKey) => {
        const benefit = this.APIsPackageNumbers[benefitRoleKey];
        const _bk = _benefitKey.toUpperCase() as keyof typeof PackageTypeEnum;
        const _bPackageType = _benefitKey as keyof typeof benefit;
        
        const benefitsData = {
          role: WebRole[_k],
          type: PackageTypeEnum[_bk],
          benefits: this.APIsPackageNumbers[benefitRoleKey][_bPackageType],
        }

        benefits.push(benefitsData);
      });
    });

    // Init to table data
    benefits.forEach(_b => {
      Object.keys(_b.benefits).forEach(_benefitKey => {
        const data = {
          role: _b.role,
          type: _b.type,
          key: _benefitKey,
          value: _b.benefits[_benefitKey],
        }

        this.displayBenefitsData.push(data)
      });
    });
  }

  onGetPackageLabel(type: PackageTypeEnum, role: WebRole) {
    let str = 'LABEL.PACKAGE_';

    switch (role) {
      case WebRole.INSTRUCTOR:
        str += 'INSTRUCTOR_';
        break;
      case WebRole.LEARNER:
        str += 'LEARNER_';
        break;
      default:
        break;
    }

    switch (type) {
      case PackageTypeEnum.FREE:
        return str + 'FREE';
      case PackageTypeEnum.PRO:
        return str + 'PRO';
      default:
        break;
    }

    return str;
  }

  onEditPrice() {}
}
