import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  loginForm!: FormGroup;

  constructor(private authService: AuthService,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]]
    })
  }

  loginUser() {
    const value = this.loginForm.value;
    this.loading = true;
    this.authService.login(value['email'], value['password']);
    this.loading = false;
  }

  showErrorMessage() {
    return this.authService.error_message
  }
}
