import { Routes } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './add-user/add-user.component';
import { RegisterComponent } from './register/register.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { ProductCreateComponent } from './product-manager/product-create/product-create.component';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'list-user', pathMatch: 'full', data: null},
  {path: 'users', component: UserListComponent, data: {name: 'User Manage', icon: 'fas fa-users-cog', scope: 'read:user'}},
  {path: 'user/:userId', component: AddUserComponent, data: {name: 'Create User', icon: 'fas fa-user-plus', scope: 'write:user'}},
  {path: 'profile', component: ProfileComponent, data: {name: 'Profile', icon: 'fas fa-address-card', scope:'openid'}},
  {path: 'products', component: ProductManagerComponent, data: {name : 'Products', icon: 'fas fa-address-card', scope:'write:user'}},
  {path: 'orders', component: OrderManagerComponent, data: {name : 'Orders', icon: 'fas fa-address-card', scope:'write:user'}},
  {path: 'product-new', component: ProductCreateComponent},
  {path: 'register', component: RegisterComponent}
]

export const routing = RouterModule.forRoot(routes);