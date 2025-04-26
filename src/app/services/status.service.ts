import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatusChange} from '../models/status-change';
import {ConfigService} from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/statuses`;
  }

  getAvailableStatuses(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl);
  }

  changeStatus(applicationId: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${applicationId}`, {status});
  }

  getStatusHistory(applicationId: number): Observable<StatusChange[]> {
    return this.http.get<StatusChange[]>(`${this.baseUrl}/${applicationId}/history`);
  }
}
