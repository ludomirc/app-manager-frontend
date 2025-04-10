import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Application} from '../models/application.model';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private baseUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.baseUrl);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/${id}`);
  }

  createApplication(app: Application): Observable<Application> {
    return this.http.post<Application>(this.baseUrl, app);
  }
}
