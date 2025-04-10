import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Enterprise {
  enterpriseId: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  private baseUrl = environment.apiUrl;
  private enterprisesUrl = `${this.baseUrl}/enterprises`;

  constructor(private http: HttpClient) {}

  getEnterprises(): Observable<Enterprise[]> {
    return this.http.get<Enterprise[]>(this.enterprisesUrl);
  }

  createEnterprise(name: string): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.enterprisesUrl, { name });
  }
}
