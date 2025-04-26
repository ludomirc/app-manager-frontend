import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Application} from '../models/application.model';
import {Observable} from 'rxjs';

import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/applications`;
  }

  constructor(private http: HttpClient,
              private configService: ConfigService) {
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
