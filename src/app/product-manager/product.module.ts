import { ProductManagerComponent } from './product-manager.component';
import { SharedModule } from '../shared/shared.module';
import { ProductService } from './product.service';
import { ProductCreateComponent } from './product-create/product-create.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [ProductManagerComponent, ProductCreateComponent],
  imports: [ CommonModule ,
  BrowserModule,
  CKEditorModule,
SharedModule],
  exports: [],
  providers: [ProductService],
})
export class ProductModule {}