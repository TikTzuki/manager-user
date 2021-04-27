import { routes } from '../../../app.routes';
import { ConfigurationService } from '../../service/configuration.service';
import { SecurityService } from '../../service/security.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routes
  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    if (this.configurationService.isReady) {
      console.log(this.routes);
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        console.log(this.routes);
      })
    }
      this.routes = routes;
  }
}
