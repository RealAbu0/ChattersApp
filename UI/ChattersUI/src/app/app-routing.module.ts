import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { GuestPageComponent } from './components/guest-page/guest-page.component';
import { ChatDashboardPageComponent } from './components/chat-dashboard-page/chat-dashboard-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ChatRoomPageComponent } from './components/chat-room-page/chat-room-page.component';
import { RoomGuardGuard } from './guards/room-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'home-page',
    component: HomePageComponent
  },
  {
    path: 'login-page',
    component: LoginPageComponent
  },
  {
    path: 'signup-page',
    component: SignupPageComponent
  },
  {
    path: 'error404',
    component: ErrorPageComponent
  },
  {
    path: 'guest-page',
    component: GuestPageComponent
  },
  {
    path: 'chat-dashboard-page',
    component: ChatDashboardPageComponent,
    canActivate: [AuthGuard]
   },
  {
    path: "room/:roomId",
    component: ChatRoomPageComponent,
    canActivate: [RoomGuardGuard]
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
