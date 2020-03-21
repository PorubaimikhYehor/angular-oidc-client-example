import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-angular-oidc-client-example';
  constructor(
    private authService: AuthService
  ) { }
  get isLoggedIn() {
    return this.authService.isLoggedIn()
  }
  logout() {
    this.authService.logout()
  }
}
