import { IProduct } from '../shared/models/product.model';
import { Observable } from 'rxjs';
import { ICatalog } from '../shared/models/catalog.model';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ConfigurationService } from '../shared/service/configuration.service';
import { SecurityService } from '../shared/service/security.service';
import { StorageService } from '../shared/service/storage.service';
import { DataService } from '../shared/service/data.service';
import { IProductForm } from '../shared/models/createProductForm.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
   private productUrl: string = '';
  private brandUrl: string= '';
  private categoryUrl: string = ''
  constructor(
    private service: DataService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private storageService: StorageService
  ) {
    if (this.configurationService.isReady) {
      // this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products';
      this.productUrl = 'http://localhost:8080' + '/api/products';
;
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        // this.productUrl = this.configurationService.serverSettings.purchaseUrl + '/api/products';
      this.productUrl = 'http://localhost:8080' + '/api/products';
      });
    }

  }

  getCatalog(params?: { [param: string]: any }): Observable<ICatalog<IProduct>> {
    let url = this.productUrl;
    if (params && Object.values(params).some(value => value)) {
      url += '?';
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      url = url.substring(0, url.lastIndexOf('&'));
    }
    return this.service.get(url).pipe<ICatalog<IProduct>>(tap((response: any) => {
      return response;
    }));
  }

  deleteProduct(product: IProduct):Observable<any>{
    let url = `${this.productUrl}/${product.item_id}`;
    return this.service.put(url, product);
  }

  // fetchFile(url:string):Observable<Blob>{
  //   return this.service.getFile(url);
  // }

  createProduct(product:any):Observable<any>{
    let url = this.productUrl;
    return this.service.post(url,product);
  }

}