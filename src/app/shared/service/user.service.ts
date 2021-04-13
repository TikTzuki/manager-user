import { SecurityService } from './security.service';
import { ConfigurationService } from './configuration.service';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IUser } from '../models/user.model';
import { DebugElement } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl:string;
  constructor(
    private securityService: SecurityService,
    private configurationService: ConfigurationService,
    private service: DataService
  ) {
      if (this.configurationService.isReady) {
        this.userUrl = configurationService.serverSettings.purchaseUrl + '/api/users';
      } else {
        this.configurationService.settingLoaded$.subscribe({
          next: x => {
        this.userUrl = configurationService.serverSettings.purchaseUrl + '/api/users';
          }
        })
      }
  }

  getUsers(){
    const url = this.userUrl;
    return this.service.get(url).pipe<IUser[]>(tap((res:any) =>{
      return res;
    }))
  }

  getUserById(id:number){
    const url = this.userUrl + '/' + id;
    return this.service.get(url).pipe<IUser>(tap((res:any)=>{
      return res;
    }));
  }

  createUser(user:IUser){
    const url = this.userUrl;
    return this.service.post(url, user);
  }

  updateUser(user:IUser){
    const url = this.userUrl + '/' + user.id;
    return this.service.put(url, user);
  }

  deleteUser(id:number){
    const url = this.userUrl + '/' + id;
    return this.service.delete(url).subscribe({
      next: res=>{ },
      complete: ()=>{
        window.location.reload();
      }
    })
  }
}