import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthServiceService } from 'src/app/service/auth/auth-service.service';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss']
})
export class GuestPageComponent implements OnInit {

  formGroup!: FormGroup;
  guestUserName: any;
  constructor(private fb: FormBuilder, private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      guestname: ['', Validators.required]
    });
  }


  submitGuestName(){
    if(this.formGroup.valid){

      this.guestUserName = this.formGroup.get('guestname')?.value;

     

      this.authService.guestName(this.guestUserName).subscribe({
        next: (res) => {
          console.log(res);
          this.guestUserName += res;
          console.log("after the service name: " + this.guestUserName);
          
        },

        error: (err) => {
          console.log(err);
          console.log("it has failed");
        }
      });
    }
    else{
      this.validateAllForms(this.formGroup);
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
