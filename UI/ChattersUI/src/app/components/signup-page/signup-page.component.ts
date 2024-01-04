import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth/auth-service.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-sharp fa-solid fa-eye-slash";

  signupForm!: FormGroup;


  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
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

  signUpBtn(){
    if(this.signupForm.valid){
      console.log(this.signupForm.value);
      this.authService.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          console.log("an account has been created");
          alert(res.message);
          this.router.navigate(['login-page'])
        },
        error: (err) => {
          alert(err.message);
          console.log(err);
        }
      })
    }
    else{
      this.validateAllForms(this.signupForm);
      console.log('an error has occured');
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
    })
  }

}
