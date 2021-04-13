import { SecurityService } from '../../service/security.service';
import { ConfigurationService } from '../../service/configuration.service';
import { config } from '../../../../../e2e/protractor.conf';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user:IUser;
  constructor(
    private securityService: SecurityService,
    private configurationService: ConfigurationService
  ) {
    if(securityService.IsAuthorized){
      this.user = securityService.UserData;
    }
  }

  logoff(){
    this.securityService.Logoff();
  }

  ngOnInit() {
  }

}
