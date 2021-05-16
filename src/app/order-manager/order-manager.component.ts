import { IOrder } from '../shared/models/order.model';
import { IPager } from '../shared/models/pager.model';
import { ConfigurationService } from '../shared/service/configuration.service';
import { SecurityService } from '../shared/service/security.service';
import { ConfirmModalComponent } from '../shared/components/confirm-modal/confirm-modal.component';
import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EOrderStatus } from '../shared/models/orderStatus.const';
import { OrderService } from './order.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.scss']
})
export class OrderManagerComponent implements OnInit {
  selectedTab: string = EOrderStatus.All;
  searchFormGroup: FormGroup;
  orders: IOrder[] = [];
  selectedOrders: IOrder[] = [];
  toggledOrders: number[] = [];
  Authenticated:boolean = false;
  currentQuery = {
    pageIndex: 0,
    pageSize: 10,
    status: null,
  };
  OrderStatus = [
    { name: 'All', value: EOrderStatus.All },
    { name: 'Pending', value: EOrderStatus.Pending },
    { name: 'Ready To Ship', value: EOrderStatus.ReadyToShip },
    { name: 'Shipped', value: EOrderStatus.Shipped },
    { name: 'Delivered', value: EOrderStatus.Delivered },
    { name: 'Canceled', value: EOrderStatus.Canceled }
  ];
  EOrderStatus = EOrderStatus;
  paginationInfo: IPager;
  constructor(
    private service: OrderService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.Authenticated = this.securityService.IsAuthorized;
    if (this.configurationService.isReady) {
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.loadData();
      })
    }
  }

  changeTab(orderStatus: string) {
    this.selectedTab = orderStatus;
    this.selectedOrders = [];
    this.currentQuery = { ...this.currentQuery, pageIndex: 0, status: orderStatus };
    this.getOrdersCatalog(this.currentQuery);
  }

  loadData() {
    this.getOrdersCatalog(this.currentQuery);
    this.loadSearchForm();
  }

  getOrdersCatalog(query?: { [param: string]: any }) {
    this.service.getOrdersCatalog(query).subscribe({
      next: catalog => {
        this.orders = catalog.data;
        console.log(this.orders);
        this.paginationInfo = {
          actualPage: catalog.pageIndex,
          itemsPage: catalog.pageSize,
          totalItems: catalog.count,
          items: catalog.data.length,
          totalPages: Math.ceil(catalog.count / catalog.pageSize)
        }
      }
    })
  }

  loadSearchForm() {
    this.searchFormGroup = new SearchFormGroup({
      createdAfter: new FormControl(null),
      createdBefore: new FormControl(null),
      updateAfter: new FormControl(null),
      updateBefore: new FormControl(null)
    });
  }

  searchOrder() {
    console.log(this.searchFormGroup);
    for(let [key,value] of this.Object.entries(this.searchFormGroup.value) ){
      if(value){
      this.currentQuery[key] = new Date(String(value)).toISOString().replace('.000Z',  encodeURIComponent('+0800'));
      } else {
       this.currentQuery[key] = null;
      }
    }
    this.currentQuery = { ...this.currentQuery};
    console.log(this.currentQuery);
    this.getOrdersCatalog(this.currentQuery);
  }

  onCheckOrder($event, orderId?: string) {
    console.log(orderId);
    if ($event.target.checked) {
      if (orderId) {
        this.selectedOrders.push({ ...this.orders.find(order => (order.order_id == orderId)) });
      } else {
        this.selectedOrders = [];
        this.selectedOrders.push(...this.orders);
      }
    } else {
      if (!orderId) {
        this.selectedOrders = [];
      } else {
        this.selectedOrders.splice(this.selectedOrders.findIndex(order => order.order_id == orderId), 1);
      }
    }
    console.log(this.selectedOrders);
  }

  isSelected(orderId: string) {
    return this.selectedOrders.some(order => order.order_id == orderId)
  }

  toggleOrderItem(orderId: number) {
    if (!this.toggledOrders.some(id => id == orderId)) {
      this.toggledOrders.push(orderId);
    } else {
      this.toggledOrders.splice(this.toggledOrders.indexOf(orderId), 1);
    }
    console.log(this.toggledOrders);
  }

  isToggled(orderId: number) {
    return this.toggledOrders.some(id => id == orderId);
  }

  changeStatusOrders(selectedOrders: IOrder[], status: string) {
    let confirmRef = this.modalService.open(ConfirmModalComponent);
    console.log("change status");
    confirmRef.componentInstance.message = `Change status to ${status}`
    confirmRef.result.then((result) => {
      selectedOrders.forEach(order => {
        order.statuses[0] = status;
        console.log(order);
        this.service.updateOrder(order).subscribe(x => {
          console.log(x);
        })
      });
    }, (reason) => { })
  }

  onPageChanged($event) {
    this.currentQuery.pageIndex = $event;
    this.getOrdersCatalog(this.currentQuery)
  }

  get Object() {
    return Object;
  }
}

class SearchFormGroup extends FormGroup {
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator)
  }

  get idControl(): FormControl {
    return this.get('id') as FormControl;
  }

  get createDateControl(): FormControl {
    return this.get('createDate') as FormControl;
  }

  get paymentMethodControl(): FormControl {
    return this.get('paymentMethod') as FormControl;
  }

  // get statusControl(): FormControl{
  //   return this.get('status') as FormControl;
  // }
}
