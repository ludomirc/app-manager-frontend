import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {

  private baseUrl = environment.apiUrl;

  registerForm: FormGroup;
  isRegistered = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = {
        userName: this.registerForm.value.login,
        rawPassword: this.registerForm.value.password
      };

      this.http.post(`${this.baseUrl}/users/register`, payload).subscribe({
        next: () => {
          this.isRegistered = true; // ✅ show the thank-you board
        },
        error: () => {
          // Optionally handle failure here
          alert('Registration failed. Please try again.');
        }
      });
    }
  }

}
