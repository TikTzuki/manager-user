import { IAuthorizeRequest } from '../shared/models/authorizeRequest.model';
import { SecurityService } from '../shared/service/security.service';
import { IRegistingRequest } from '../shared/models/registingRequest.model';
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
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    // this.getAccessToken(this.authRequest);
    this.authForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.pattern('')]),
      password: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      email: new FormControl(null ),
      phoneNumber: new FormControl(null )
    });
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
        scope: 'openid read:user write:user'
      };
      this.sercurityService.Register(this.authRequest);
    }
  }

  openModal(content){
    this.modalService.open(content);
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
}
