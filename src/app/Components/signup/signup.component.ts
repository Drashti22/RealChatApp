import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from   '@angular/forms'
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit  {
  type: string = "Password"
  isText: boolean = false;
  signupForm!: FormGroup;
  constructor(private fb: FormBuilder, 
              private auth: AuthService, 
              private router: Router,
              private toast: NgToastService){}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      Name: ['', Validators.required],
      email: ['', Validators.required ],
      password: ['', Validators.required]
    })
  }
  onSignup(){
    if(this.signupForm.valid){

      console.log(this.signupForm.value)
      //send the obj to db
      this.auth.signUp(this.signupForm.value)
    .subscribe({
      next:(res=>{
        alert(res.message);
        this.toast.success({detail: "SUCCESS", summary:res.message, duration: 2000});
        this.router.navigate(['/login'])
        this.signupForm.reset();
      })
      ,error:(err=>{
        alert(err?.error.message)
      })
    })
    }
    else{
      console.log("form is not valid")
      this.validateAllFormFields(this.signupForm);
      alert("Your form is invalid !!")
      this.toast.error({detail: "ERROR", summary:"Your form is invalid !!", duration: 2000})

      //throw the error using toaster
    }
  }
  private validateAllFormFields(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }

}

