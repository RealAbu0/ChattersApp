import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../service/auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router){}
  canActivate():boolean {
    if(this.authService.isLoggedIn()){
      return true;
    }
    else{
      alert("Cant access this page without logging in");
      this.router.navigate(['login-page']);
      return false;
    }
  }
  
}
