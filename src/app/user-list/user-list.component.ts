import { SecurityService } from '../shared/service/security.service';
import { ConfigurationService } from '../shared/service/configuration.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/service/user.service';
import { IUser } from '../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: IUser[];
  authSubscription: Subscription;
  authenticated:boolean = false;
  constructor(
    private securityService: SecurityService,
    private configurationService: ConfigurationService,
    private service: UserService
  ) {
  }

  ngOnInit() {
    if (this.securityService.IsAuthorized) {
      if (this.configurationService.isReady) {
        this.loadData();
      } else {
        this.configurationService.settingLoaded$.subscribe(x => {
          this.loadData();
        })
      }
    }
    this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res=>{
      this.authenticated = res;
    })
  }

  loadData(){
      // Load data
      this.service.getUsers().subscribe({
        next: res =>{
          this.users = res;
        }
      })
  }

  deleteUser(id:number){
    this.service.deleteUser(id);
  }
}
