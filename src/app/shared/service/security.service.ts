import { StorageService } from './storage.service';
import { Subject, Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { error } from 'protractor';
import { IAuthorizeRequest } from '../models/authorizeRequest.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IRegistingRequest } from '../models/registingRequest.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private actionUrl!: string;
  private headers: HttpHeaders;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge$ = this.authenticationSource.asObservable();
  private identityUrl = '';
  private storage;

  public UserData: any;
  public IsAuthorized!: boolean;
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private _storageService: StorageService,
  ) {
    console.log('constructor');
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = _storageService;

    this.configurationService.settingLoaded$.subscribe(x => {
      this.identityUrl = this.configurationService.serverSettings.identityUrl;
      this.storage.store('identityUrl', this.identityUrl);
    });

    if (this.storage.retrieve('isAuthorized') !== '') {
      this.IsAuthorized = this.storage.retrieve('isAuthorized');
      this.UserData = this.storage.retrieve('userData');
      this.authenticationSource.next(true);
      console.log(this.UserData);
    }
  }

  public GoToLoginPage(){
    this._router.navigate(['/sign-in']);
  }

  public Authorize(authorizedRequest: IAuthorizeRequest) {
    this.ResetAuthorizationData();
      const url = this.identityUrl.endsWith('/') ? this.identityUrl : `${this.identityUrl}/connect/authenticate`;
      console.log(authorizedRequest, url);
      this._http.post(url, JSON.stringify(authorizedRequest), this.setHeaders()).pipe<IAuthorizeResponseSuccess>(
        tap((res: any) => {
          if (res.status >= 200 && res.status < 300) {
            return res;
          }
          return false;
        })
      ).subscribe({
        next: res => {
          this.SetAuthorizationData(res.token, res.refreshToken);
        },
        error: (err) => window.alert("wrong username or password")
      });
  }

  public Register(registingRequest: IRegistingRequest){
    const url = this.identityUrl.endsWith('/') ? this.identityUrl : `${this.identityUrl}/connect/register`;
    console.log(registingRequest, url);
    this._http.post(url, JSON.stringify(registingRequest), this.setHeaders()).pipe<IAuthorizeResponseSuccess>(
      tap((res:any)=>{
        if(res.status >= 200 && res.status <300){
          return true;
        }
        return false;
      })
    ).subscribe({
      next: res=>{
          window.alert("success!!!");
      },
      error: err => window.alert("wrong input")
    })
  }

  public SetAuthorizationData(token: any, idToken: any) {
    this.storage.store('accessToken', token);
    this.storage.store('refreshToken', idToken);
    this.IsAuthorized = true;
    this.storage.store('isAuthorized', true);

    // TODO: replace for get user data
  // this.UserData = this.storage.retrieve('userData');
    let tokenData:any = this.getDataFromToken(token);
    this.storage.store('tokenData', tokenData);
    this.getUserData()
      .subscribe(data => {
        this.UserData = data;
        this.storage.store('userData', data);
        //emit observable
        this.authenticationSource.next(true);
        window.location.href = location.origin;
      },
        error => this.HandleError(error),
        () => {
          console.log(this.UserData);
        });
  }

  public Logoff() {
    this.ResetAuthorizationData();

    this.authenticationSource.next(false);
    window.location.href = location.origin;
  }

  public HandleError(error: any) {
    console.log(error);
    if (error.status == 403) {
      this._router.navigate(['/Forbidden']);
    } else if (error.status == 401) {
      this._router.navigate(['/Unauthorized']);
    }
  }

  private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  private getDataFromToken(token: any) {
    let data = {};

    if (typeof token !== 'undefined') {
      let encoded = token.split('.')[1];
      /*
{
"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "0931421322",
  "jti": "26bc8655-2028-498f-8fc3-428e19db83db",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "customer",
  "exp": 1619705815,
  "iss": "http://localhost:5001",
  "aud": "http://localhost:4200"
}
       */
      data = JSON.parse(this.urlBase64Decode(encoded));
    }
    return data;
  }

  private getUserData(): Observable<string[]>{
    if(this.identityUrl === ''){
      this.identityUrl = this.storage.retrieve('identityUrl');
    }

    const options = this.setHeaders();

    return this._http.get<string[]>(`${this.identityUrl}/connect/userinfo`, options)
    .pipe<string[]>((info:any) => info);
  }

  private setHeaders():any {
    console.log("set header");
    const httpOptions = {
      headers: new HttpHeaders()
    }

    httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    httpOptions.headers = httpOptions.headers.set('Accept', 'application/json');

    const token = this.GetToken();

    if(token !== '' && token !== undefined){
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }
    return httpOptions;
  }

  public ResetAuthorizationData() {
    this.IsAuthorized = false;
    this.storage.store('isAuthorized', this.IsAuthorized);
  }

  GetToken(): any {
    if(this.isExpried(this.storage.retrieve('accessToken'))){
      this.ResetAuthorizationData();
    }
    return this.storage.retrieve('accessToken');
  }

  isExpried(token):boolean{
    let tokenPayload:any = this.getDataFromToken(token);
    return new Date(tokenPayload.exp*1000) <= new Date() ? true : false;
  }

  checkScope(feature:string):boolean{
    return this.UserData.scope.indexOf(feature) != -1 ? true : false ;
  }
}

interface IAuthorizeResponseSuccess {
  token: string,
  refreshToken: string,
  expiration: string
}