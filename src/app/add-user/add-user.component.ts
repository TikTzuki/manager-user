import { ConfigurationService } from '../shared/service/configuration.service';
import { SecurityService } from '../shared/service/security.service';
import { UserService } from '../shared/service/user.service';
import { Subscription } from 'rxjs';
import { IUser } from '../shared/models/user.model';
import { FormArray } from '@angular/forms';
import { FormArrayName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Form, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { isNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
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
    const routeParam = this.route.snapshot.paramMap;
    const userId = Number(routeParam.get('userId'));
    if (this.securityService.IsAuthorized) {
      if (this.configurationService.isReady) {
        this.loadData(userId);
      } else {
        this.configurationService.settingLoaded$.subscribe(x => {
          this.loadData(userId);
        })
      }
    }
    this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res=>{
      this.authenticated = res;
    })
  }

  loadData(userId: number) {
    if (!isNaN(userId)) {
      this.service.getUserById(userId).subscribe({
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
    } else {
      this.userForm = new FormGroup({
        id: new FormControl(NaN, [Validators.required]),
        userName: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        scope: new FormControl('', [Validators.required])
      })
    }
  }

  isContraintScope(feature){
    return this.scope.value.indexOf(feature) != -1 ? true : false;
  }
  
  saveUser(id:number){
    console.log(this.userForm);
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
      this.scope.setValue( (this.scope.value+' '+ $event.target.value+' ').trim() );
    } else {
      let str = this.scope.value;
      this.scope.setValue(str.replace($event.target.value, '').trim());
    }
    console.log(this.userForm);
  }

  togglePassword(){
    this.isShow = !this.isShow;
  }

  isNaN(id){
    return isNaN(id) ?true :false ;
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
  }  
}
