import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from './shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { routing } from './app.routes';

@NgModule({
  declarations: [						
    AppComponent,
      LoginComponent,
      RegisterComponent,
      ProfileComponent,
      UserListComponent,
      AddUserComponent
   ],
  imports: [
    BrowserModule,
    routing,
    AppRoutingModule,
    SharedModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
