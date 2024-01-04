import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private userPayload: any;
 
  

  constructor(private http: HttpClient, private router: Router) { 
    this.userPayload = this.decodedToken();
  }


  // All Login and Sign up Methods
  login(loginObj: any){
    return this.http.post<any>(`${environment.apiUrl}/User/authenticate`, loginObj);
  }

  signUp(signUpObj: any){
    return this.http.post<any>(`${environment.apiUrl}/User/register`, signUpObj);
  }

  signOut(){
    localStorage.clear();

   
    alert("You have signed out");

    this.router.navigate(['login-page']);
  }

  isLoggedIn() : boolean{
    return !!localStorage.getItem('token');
  }

  // Guest Method
  guestName(name: string){
    return this.http.post<string>(`${environment.apiUrl}/User/guestname`, name);
  }


  // Token Methods
  public storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  public getToken(){
    return localStorage.getItem('token');
  }

  public decodedToken(){
    const jwtHelper = new JwtHelperService();

    const token = this.getToken()!;

    console.log(jwtHelper.decodeToken(token));

    return jwtHelper.decodeToken(token);
  }

  public getFullNameFromToken(){
    if(this.userPayload){
      return this.userPayload.unique_name;
    }
  }

  public getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload.role;
    }
  }

  public getUserNameFromToken(){
    if(this.userPayload){
      return this.userPayload.nameid;
    }
  }

 

  
}
