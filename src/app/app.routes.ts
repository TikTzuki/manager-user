import { Routes } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './add-user/add-user.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'list-user', pathMatch: 'full', data: null},
  {path: 'users', component: UserListComponent, data: {name: 'User Manage', icon: 'fas fa-users-cog', scope: 'read:user'}},
  {path: 'user/:userId', component: AddUserComponent, data: {name: 'Create User', icon: 'fas fa-user-plus', scope: 'write:user'}},
  {path: 'profile', component: ProfileComponent, data: {name: 'Profile', icon: 'fas fa-address-card', scope:'openid'}},
  {path: 'register', component: RegisterComponent}
]

export const routing = RouterModule.forRoot(routes);