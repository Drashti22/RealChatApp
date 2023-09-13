import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from   '@angular/forms'
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService, ExternalAuthDto } from 'src/app/Services/auth.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import * as google from 'google-one-tap';
import { HttpErrorResponse } from '@angular/common/http';



declare global {
  interface Window {
    onGoogleLibraryLoad: () => void;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  type: string = "Password"
  isText: boolean = false;
  loginForm!: FormGroup;
  showError!: boolean;
  errorMessage!: string;
  constructor(private fb: FormBuilder,
              private auth: AuthService, 
              private router : Router,
              private toast: NgToastService,
              ){}

  ngOnInit(): void {
    this.externalLogin()
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      //send the obj to db
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          this.toast.success({detail: "SUCCESS", summary:res.message, duration: 2000});
          this.auth.storeToken(res.profile.token);
          console.log(res.profile.token)
          console.log('API Response:', res);
          console.log('User ID:', res.profile.id);
          this.auth.setLoggedInUserId(res.profile.id);
          console.log('Set User ID:', res.profile.id);
          this.router.navigate(['dashboard']);
        //  console.log(res.message);
         this.loginForm.reset();
         
        },
        // error:(err)=>{
        //   // alert(err?.error.message);
        //   this.toast.error({detail: "ERROR", summary:err?.error.message, duration: 2000})
        // }
      })
    }
    else{
      console.log("form is not valid")
      this.validateAllFormFields(this.loginForm);
      alert("Your form is invalid !!")
      //throw the error using toaster
    }
  }
  private validateAllFormFields(formGroup: FormGroup, ){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }
  externalLogin = () => {
  this.showError = false; 
  this.auth.signInWithGoogle();
  this.auth.extAuthChanged.subscribe(user => {
    const externalAuth: ExternalAuthDto = {
      idToken: user.idToken
    }
    this.validateExternalAuth(externalAuth);
  });

  
}
private validateExternalAuth(externalAuth: ExternalAuthDto) {
  this.auth.externalLogin(externalAuth).subscribe({
    next: (res) => {
      localStorage.setItem("token", res.token);
      // console.log('res', res.token);
      this.router.navigateByUrl('/userlist');
    },
    error: (err: HttpErrorResponse) => {
      this.errorMessage = err.message;
      this.showError = true;
    }
  });
}

}
