import { Subscription } from 'rxjs';
import { SecurityService } from './shared/service/security.service';
import { ConfigurationService } from './shared/service/configuration.service';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Authenticated: boolean = false;
  subscription!: Subscription;
  isLoggin: boolean = true;
  constructor(
    private titleService: Title,
    private securityService: SecurityService,
    private configurationService: ConfigurationService
  ) {
    this.Authenticated = this.securityService.IsAuthorized;
  }

  ngOnInit(): void {
    console.log('app init');
    this.subscription = this.securityService.authenticationChallenge$.subscribe(res=> this.Authenticated=res);
    
    this.configurationService.load();
    this.setTitle('Manage User');
  }

  public setTitle(newTitle: string){
    this.titleService.setTitle(newTitle);
  }

  swichlog(){
    this.isLoggin=!this.isLoggin;

  }
}