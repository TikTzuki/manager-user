import { IAuthorizeRequest } from '../shared/models/authorizeRequest.model';
import { SecurityService } from '../shared/service/security.service';
import { IRegistingRequest } from '../shared/models/registingRequest.model';
import { ConfigurationService } from '../shared/service/configuration.service';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  authRequest: IRegistingRequest;
  authForm: FormGroup;
  constructor(
    private router: Router,
    private sercurityService: SecurityService,
    private modalService: NgbModal,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    // this.getAccessToken(this.authRequest);
    this.configurationService.settingLoaded$.subscribe(x=>{
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      email: new FormControl(null ),
      phoneNumber: new FormControl(null ),
      scope: new FormControl('')
    });
    })
  }

  // public getAccessToken(authRequest){
  //   let resp = this.service.generateToken(authRequest);
  //   resp.subscribe(data => this.accessApi(data));
  // }

  // public accessApi(token){
  //   let resp = this.service.welcome(token);
  //   resp.subscribe(data => {
  //     this.response = data;
  //     console.log(this.response);
  //   });
  // }

  signup(){
    this.authForm.markAllAsTouched();
    if(this.authForm.valid){
      this.authRequest = {
        userName: this.username.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        email: this.email.value,
        phoneNumber: this.phoneNumber.value,
        scope: this.scope.value
      };
      this.sercurityService.Register(this.authRequest);
    }
  }
  isContraintScope(feature){
    return this.scope.value.indexOf(feature) != -1 ? true : false;
  }

  openModal(content){
    this.modalService.open(content);
  }

  handleCheckScope($event){
    if($event.target.checked){
      this.scope.setValue( (this.scope.value+' '+ $event.target.value+' ').trim() );
    } else {
      let str = this.scope.value;
      this.scope.setValue(str.replace($event.target.value, '').trim());
    }
    console.log(this.authForm);
  }

  get username(): FormControl {
    return this.authForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.authForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.authForm.get('confirmPassword') as FormControl;
  }

  get email(): FormControl{
    return this.authForm.get('email') as FormControl;
  }

  get phoneNumber(): FormControl{
    return this.authForm.get('phoneNumber') as FormControl;
  }

  get scope():FormControl{
    return this.authForm.get('scope') as FormControl;
  } 
}
