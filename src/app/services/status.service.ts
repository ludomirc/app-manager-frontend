import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAvailableStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/statuses`);
  }

  changeStatus(applicationId: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/statuses/${applicationId}`, {status});
  }
}
