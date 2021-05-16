import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { StorageService } from './service/storage.service';
import { ConfigurationService } from './service/configuration.service';
import { SecurityService } from './service/security.service';
import { DataService } from './service/data.service';
import { UserService } from './service/user.service';
import { PagerComponent } from './components/pager/pager.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    HttpClientJsonpModule],
  declarations: [
    NavbarComponent,
    PageNotFoundComponent,
    HeaderComponent,
    PagerComponent,
    ConfirmModalComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    HeaderComponent,
    PageNotFoundComponent,
    PagerComponent,
    ConfirmModalComponent
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule>{
    return {
      ngModule: SharedModule,
      providers: [
        StorageService,
        ConfigurationService,
        SecurityService,
        DataService,
        UserService
      ]
    }
  }
}