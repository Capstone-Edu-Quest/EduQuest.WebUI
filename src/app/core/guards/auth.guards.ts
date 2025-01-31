import { CanActivate, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}
    
    canActivate(): boolean {
        if(this.userService.user$.value) {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
  }