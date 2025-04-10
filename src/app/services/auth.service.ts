import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {Credentials} from '../models/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'appManagerAuthToken';
  private readonly baseUrl = `${environment.apiUrl}/users`

  constructor(private http: HttpClient) {
  }

  login(credentials: Credentials): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, credentials).pipe(
      tap(response => {
        if (response?.token) {
          sessionStorage.setItem(this.TOKEN_KEY, response.token);
        }
      }));
  }

  register(user: Credentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
