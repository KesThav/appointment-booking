import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  loading: boolean = false;
  signupForm!: FormGroup;

  constructor(private authService: AuthService,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.authService.firebaseConnexion();
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword:['',[Validators.required,Validators.minLength(8)]]
    })
  }

  createUser() {
    const value = this.signupForm.value;
    this.loading = true;
    this.authService.signin(value['email'], value['password']);
    this.loading = false;
  }

}
