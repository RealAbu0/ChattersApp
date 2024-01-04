import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ApiServiceService } from '../service/api/api-service.service';

@Injectable({
  providedIn: 'root'
})



export class RoomGuardGuard implements CanActivate {

  constructor(private apiService: ApiServiceService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const roomId = route.paramMap.get('roomId');

      if(!roomId){
        this.router.navigate(['error404']);
        return false;
      }

      return this.roomValidate(roomId!, route);
  }

  private roomValidate(roomId: string, route: ActivatedRouteSnapshot){
    return new Promise<boolean>(resolve => {
      this.apiService.getOneRoom(roomId).pipe(take(1)).subscribe(room => {
        if(room && room.roomId == roomId){
          resolve(true);
        }
        else{
          this.router.navigate(['page404']);
        }
      });
    });
  }
  
}
