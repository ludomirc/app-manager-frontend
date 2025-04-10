import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Credentials} from '../../models/credentials';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isRegistered = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
    this.registerForm = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = this.getCredentialFromForm();
      this.authService.register(payload).subscribe({
        next: () => {
          this.isRegistered = true;
        },
        error: () => {
          alert('Registration failed. Please try again.');
        }
      });
    }
  }

  private getCredentialFromForm() {
    const payload: Credentials = {
      userName: this.registerForm.value.login,
      rawPassword: this.registerForm.value.password
    };
    return payload;
  }
}
