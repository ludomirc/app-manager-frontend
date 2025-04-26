import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ConfigService} from './config.service';

export interface Enterprise {
  enterpriseId: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  private get enterprisesUrl(): string {
    return `${this.configService.apiUrl}/enterprises`;
  }

  getEnterprises(): Observable<Enterprise[]> {
    return this.http.get<Enterprise[]>(this.enterprisesUrl);
  }

  createEnterprise(name: string): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.enterprisesUrl, {name});
  }
}
