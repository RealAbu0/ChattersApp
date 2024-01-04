import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreServiceService {

  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private userName$ = new BehaviorSubject<string>("");

  constructor() { }

  // Roles
  public getRole(){
    return this.role$.asObservable();
  }

  public setRole(role: string){
    this.role$.next(role);
  }


  // FullNames
  public getFullName(){
    return this.fullName$.asObservable();
  }

  public setFullName(fullName: string){
    this.fullName$.next(fullName);
  }


  // UserNames
  public getUserName(){
    return this.userName$.asObservable();
  }

  public setUserName(userName: string){
    this.userName$.next(userName);
  }
}
