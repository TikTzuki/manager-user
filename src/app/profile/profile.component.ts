import { Subscription } from 'rxjs';
import { ConfigurationService } from '../shared/service/configuration.service';
import { SecurityService } from '../shared/service/security.service';
import { UserService } from '../shared/service/user.service';
import { IUser } from '../shared/models/user.model';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  authSubscription: Subscription;
  authenticated:boolean = false 
  userForm: FormGroup;
  isShow = false;
  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private service: UserService,
    private route:ActivatedRoute
  ) { }

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

  loadData() {
      this.service.getUserById(this.securityService.UserData.id).subscribe({
        next: res => {
          const user:IUser = res;
          this.userForm = new FormGroup({
            id: new FormControl(user.id, [Validators.required]),
            userName: new FormControl(user.userName, [Validators.required]),
            phoneNumber: new FormControl(user.phoneNumber, [Validators.required]),
            email: new FormControl(user.email, [Validators.required]),
            password: new FormControl(user.password, [Validators.required]),
            scope: new FormControl(user.scope, [Validators.required])
          })
        }
      })
  }

  isContraintScope(feature){
    return this.scope.value.indexOf(feature) != -1 ? true : false;
  }
  
  saveUser(id:number){
    console.log(this.userForm.value);
    console.log(this.id);
    if(!isNaN(this.id)){
      console.log('update');
      this.service.updateUser(this.userForm.value).subscribe({
        next: res=> console.log(res)
      })
    } else {
      console.log('create');
      this.service.createUser(this.userForm.value).subscribe({
        next: res => console.log(res)
      })
    }
  }

  handleCheckScope($event){
    if($event.target.checked){
      this.scope.setValue(this.scope.value + $event.target.value+' ');
    } else {
      let str = this.scope.value;
      this.scope.setValue(str.replace($event.target.value+' ', ''));
    }
    console.log(this.userForm);
  }

  togglePassword(){
    this.isShow = !this.isShow;
  }

  get id():number{
    return this.userForm.get('id').value;
  }

  get username():FormControl{
    return this.userForm.get('userName') as FormControl;
  }

  get phone(): FormControl{
    return this.userForm.get('phoneNumber') as FormControl;
  }

  get email():FormControl{
    return this.userForm.get('email') as FormControl;
  }

  get password():FormControl{
    return this.userForm.get('password') as FormControl;
  }

  get scope():FormControl{
    return this.userForm.get('scope') as FormControl;
  }  }
