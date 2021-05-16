import { OrderService } from './order.service';
import { SharedModule } from '../shared/shared.module';
import { OrderManagerComponent } from './order-manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OrderManagerComponent],
  imports: [CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    SharedModule],
  providers: [OrderService],
})
export class OrderModule { }