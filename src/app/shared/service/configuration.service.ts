import { IConfiguration } from '../models/configuration.model';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  serverSettings: IConfiguration;
  private settingsLoadedSource = new Subject();
  settingLoaded$ = this.settingsLoadedSource.asObservable();
  isReady: boolean = false;
  constructor(private http: HttpClient, private storageService: StorageService) {
  }

  load(){
    const url = `https://cube-spark.herokuapp.com/home/config`;
    this.http.get(url).subscribe((response) => {
      console.log('server setting loaded');
      this.serverSettings = response as IConfiguration;
      //TODO: Dotnet core config
      // this.serverSettings = {
      //   identityUrl: 'https://localhost:5001',
      //   purchaseUrl: 'https://localhost:5001'
      // }
      //TODO: Spring config
      // this.serverSettings = {
      //   identityUrl: 'http://localhost:8080',
      //   purchaseUrl: 'http://localhost:5001'
      // }
      //TODO: Json-server config
      // this.serverSettings = {
      //   identityUrl: 'https://localhost:5001',
      //   purchaseUrl: 'http://localhost:3000',
      // }
      
      this.storageService.store('identityUrl', this.serverSettings.identityUrl);
      this.storageService.store('purchaseUrl', this.serverSettings.purchaseUrl);
      this.isReady = true;
      this.settingsLoadedSource.next();
    });
  }
}