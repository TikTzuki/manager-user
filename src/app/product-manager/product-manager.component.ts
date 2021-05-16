import { ConfirmModalComponent } from '../shared/components/confirm-modal/confirm-modal.component';
import { IProduct } from '../shared/models/product.model';
import { Subscription } from 'rxjs';
import { EProductStatus } from '../shared/models/productStatus.const';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import numberOnly from '../shared/utils/validators';
import { IPager } from '../shared/models/pager.model';
import { ConfigurationService } from '../shared/service/configuration.service';
import { SecurityService } from '../shared/service/security.service';
import { ProductService } from './product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss']
})
export class ProductManagerComponent implements OnInit {
  numberOnly:Function = numberOnly;
  authenticated: boolean = false;
  authSubscription: Subscription;
  selectedTab: string = EProductStatus.All;
  currentQuery = {
    pageIndex: 0,
    pageSize: 10,
    status: null,
  }
  EProductStatus = EProductStatus;
  ProductStatus = [
    {name: 'All', value: EProductStatus.All},
    {name: 'Active', value:EProductStatus.Active},
    {name: 'Inactive', value:EProductStatus.Inactive}
  ]
  productList: any = [];
  searchFormGroup: FormGroup;
  paginationInfo: IPager;
  constructor(
    private configurationService:ConfigurationService,
    private securityService: SecurityService,
    private service: ProductService,
    private modalService: NgbModal
  ) { 

  }

  ngOnInit() {
      this.authenticated = this.securityService.IsAuthorized;
    if(this.configurationService.isReady){
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData();
      });
    }
    this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res=>{
      // this.authenticated = res;
    })
  }

  changeTab(status: string) {
    this.selectedTab = status;
    this.currentQuery = {...this.currentQuery, pageIndex: 0, status: status};
    this.getCatalog(this.currentQuery);
  }

  loadData(){
    this.getCatalog(this.currentQuery);
    this.loadSearchForm();
  }

  getCatalog(params: {[param:string]:any} ){
    this.service.getCatalog(params).subscribe({
      next: catalog => {
          this.productList = [];
        //Load list product
        // catalog.data.forEach(product => {
        //   let productTemp:IProduct={
        //     ...product,
        //     totalAvailable: 0,
        //     minPrice: Number.MAX_SAFE_INTEGER,
        //     maxPrice: 0
        //   }
        //   product.skus.forEach(sku=>{
        //     productTemp.totalAvailable += sku.available;
        //     if(productTemp.minPrice>sku.price){
        //       productTemp.minPrice = sku.price;
        //     }
        //     if(productTemp.maxPrice<sku.price){
        //       productTemp.maxPrice = sku.price;
        //     }
        //   })
        //   this.productList.push(productTemp);
        // });
        this.productList = catalog.data;
        // Load page info
        this.paginationInfo = {
          actualPage : catalog.pageIndex,
          itemsPage : catalog.pageSize,
          totalItems: catalog.count,
          items: catalog.data.length,
          totalPages: Math.ceil(catalog.count / catalog.pageSize)
        }
      }
    })
  }

  loadSearchForm(){
    this.searchFormGroup = new SearchFormGroup({
      id: new FormControl(null),
      categoryId: new FormControl(null),
      brandId: new FormControl(null),
      minPrice: new FormControl(null),
      maxPrice: new FormControl(null)
    })
  }

  searchProduct(){
    console.log(this.searchFormGroup);
    this.currentQuery = {...this.currentQuery, ...this.searchFormGroup.value} 
    this.getCatalog(this.currentQuery);
  }

  // deleteProduct(product:IProduct) {
  //   let confirmRef = this.modalService.open(ConfirmModalComponent);
  //   confirmRef.componentInstance.message = "Delete product?"
  //   confirmRef.result.then((result) => {
  //     let promiseAddress = () => Promise.all([
  //       this.service.deleteProduct(product).toPromise()
  //     ]);
  //     promiseAddress().then(() => this.loadData());
  //   }, (reason) => {});
  // }

  onPageChanged(value){
    this.currentQuery.pageIndex = value;
    this.getCatalog(this.currentQuery);
  }

  get Object(){
    return window.Object;
  }

}

class SearchFormGroup extends FormGroup{
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
      super(controls, validatorOrOpts, asyncValidator)
  }

  get idControll():FormControl{
    return this.get('id') as FormControl;
  }

  get categoryIdControl():FormControl{
    return this.get('categoryId') as FormControl;
  }

  get brandIdControl():FormControl{
    return this.get('brandId') as FormControl;
  }

  get minPrice():FormControl{
    return this.get('minPrice') as FormControl;
  }

  get maxPrice():FormControl{
    return this.get('maxPrice') as FormControl;
  }
}
