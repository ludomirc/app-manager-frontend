import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {

  private baseUrl = environment.apiUrl;

  private _loginForm: FormGroup;
  loginFailed = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this._loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  onSubmit() {
    if (this._loginForm.valid) {
      const payload = {
        userName: this._loginForm.value.login,
        rawPassword: this._loginForm.value.password
      };

      this.http.post<{ token: string }>(`${this.baseUrl}/users/authenticate`, payload).subscribe({
        next: (res) => {
          sessionStorage.setItem('appManagerAuthToken', res.token);
          this.loginFailed = false;
          this.router.navigate(['/application']);
        },
        error: () => {
          this.loginFailed = true;
        }
      });
    }
  }
}
