import {Component} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Router} from '@angular/router';
import {CommonModule} from '@angular/common';

import {AuthService} from './services/auth.service';
import {ROUTES} from './constants/routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'application-manage';

  constructor(private router: Router,
              private authService: AuthService) {
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([ROUTES.HOME]);
  }

  goHome(event: MouseEvent) {
    event.preventDefault();
    const link = this.isLoggedIn ? ROUTES.APPLICATION : ROUTES.HOME;
    this.router
      .navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate([link]));
  }
}
