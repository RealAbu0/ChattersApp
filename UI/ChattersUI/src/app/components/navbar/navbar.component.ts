import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth/auth-service.service';
import { ChatDashboardPageComponent } from '../chat-dashboard-page/chat-dashboard-page.component';
import { UserStoreServiceService } from 'src/app/service/userstore/user-store-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  myFullName = '';

  constructor(private authService: AuthServiceService, private storeService: UserStoreServiceService) { }

  ngOnInit(): void {
    this.storeService.getFullName().subscribe(res=>{
      const tokenFullName = this.authService.getFullNameFromToken();
      this.myFullName =  res || tokenFullName;
    });

 
   
  }

}
