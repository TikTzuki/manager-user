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
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { OrderModule } from './order-manager/order.module';
import { ProductModule } from './product-manager/product.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [								
    AppComponent,
      LoginComponent,
      RegisterComponent,
      ProfileComponent,
      UserListComponent,
      AddUserComponent,
   ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    CKEditorModule,
    AppRoutingModule,
    OrderModule,
    ProductModule,
    SharedModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
