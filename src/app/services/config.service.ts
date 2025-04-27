import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = {};

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/assets/config.json');
      if (!response.ok) {
        throw new Error('Failed to load config.json');
      }
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load config.json', error);
      this.config.apiUrl = ''
    }
  }

  get apiUrl(): string {
    if (!this.config.apiUrl) {
      throw new Error('API URL is not loaded.');
    }
    return this.config.apiUrl;
  }
}
