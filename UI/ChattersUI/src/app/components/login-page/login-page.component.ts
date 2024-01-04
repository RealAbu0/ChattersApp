import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { AuthServiceService } from 'src/app/service/auth/auth-service.service';
import { UserStoreServiceService } from 'src/app/service/userstore/user-store-service.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-sharp fa-solid fa-eye-slash";

  
 
  myUserName: string = "";

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router, private storeService: UserStoreServiceService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


    
  

  }

  hideShowPass(){
    this.isText = !this.isText;
    if(this.isText){
      this.eyeIcon = "fa-sharp fa-solid fa-eye";
      this.type = "text";
    }
    else{
      this.eyeIcon = "fa-sharp fa-solid fa-eye-slash";
      this.type = "password";
    }
  }

  loginBtn(){
    if(this.loginForm.valid){
      

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log("user logged in + ur token: " + res.token);
          this.loginForm.reset();

          // stores the token
          this.authService.storeToken(res.token);

          

          const tokenPayload = this.authService.decodedToken();
          this.storeService.setFullName(tokenPayload.unique_name);
          this.storeService.setUserName(tokenPayload.nameid);
          this.storeService.setRole(tokenPayload.role);

          
       

          alert("SUCCESS! " + res.message);
          this.router.navigate(['chat-dashboard-page']);
        },
        error:(err) => {
          alert(err.Messsage);
          console.log(err);
        }
      });

     
    }
    else{
      this.validateAllForms(this.loginForm)
      console.log("error error no infomation has been entered.");
    }
  }

  private validateAllForms(fg: FormGroup){
    Object.keys(fg.controls).forEach(fields => {
      const control = fg.get(fields);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf: true});
      }
      else if(control instanceof FormGroup){
        this.validateAllForms(control);
      }
    });
  }

}
