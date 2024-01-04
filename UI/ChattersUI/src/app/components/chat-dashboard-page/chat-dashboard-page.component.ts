import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiServiceService } from 'src/app/service/api/api-service.service';
import { AuthServiceService } from 'src/app/service/auth/auth-service.service';
import { UserStoreServiceService } from 'src/app/service/userstore/user-store-service.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-dashboard-page',
  templateUrl: './chat-dashboard-page.component.html',
  styleUrls: ['./chat-dashboard-page.component.scss']
})
export class ChatDashboardPageComponent implements OnInit {

  myUsers: any = [];
  public myName: string = "";
  myRole: string = "";
  myUserName: string = "";

  values!: FormGroup;

  constructor(private apiService: ApiServiceService, private storeService: UserStoreServiceService, private authService: AuthServiceService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    //this.apiService.getAllUsers().subscribe(res => {this.myUsers = res});

    this.values = this.fb.group({
      roomCode: ['', Validators.required]
    });

    console.log(this.authService.decodedToken());
  }

  createBtn(){
    this.apiService.createRoom().pipe(take(1)).subscribe({
      next: (roomId) => {
        console.log(roomId);
        this.router.navigate(['room/' + roomId]);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  joinBtn(){
    this.router.navigate(['room/' + this.values.get('roomCode')?.value])
  }

  signOutBtn(){
    this.authService.signOut();
  }



}
