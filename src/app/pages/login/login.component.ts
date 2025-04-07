import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';

import {AuthService} from '../../services/auth.service';
import {Credentials} from '../../models/credentials';
import {ROUTES} from '../../constants/routes';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {

  loginFailed = false;
  private _loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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
      const payload: Credentials = {
        userName: this._loginForm.value.login,
        rawPassword: this._loginForm.value.password
      };
      this.authService.login(payload).subscribe({
        next: () => {
          this.loginFailed = false;
          this.router.navigate([ROUTES.APPLICATION]);
        },
        error: () => {
          this.loginFailed = true;
        }
      });
    }
  }
}
