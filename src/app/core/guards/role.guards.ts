import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';
import { WebRole } from '../../shared/enums/user.enum';
import { IUser } from '../../shared/interfaces/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['allowedRoles'];
    const blockedRoles = route.data['blockedRoles'];
    const redirectUrl = route.data['redirectUrl'];

    if (
      allowedRoles &&
      allowedRoles.includes((this.userService.user$.value as IUser)?.roleId)
    ) {
      return true;
    }

    if (
      blockedRoles &&
      !blockedRoles.includes((this.userService.user$.value as IUser)?.roleId)
    ) {
      return true;
    }

    this.router.navigate([(redirectUrl && redirectUrl.length > 0) ? redirectUrl[0] : '/']);
    return false;
  }
}
