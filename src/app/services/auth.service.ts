import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager: UserManager;
  private user: User = null;

  constructor(private http: HttpClient) {
    this.load()
      .then((res: UserManagerSettings) => {
        console.log(res);
        this.manager = new UserManager(res);
        return this.manager.getUser()
      })
      .then(user => {
        this.user = user;
      });
  }

  load() {
    const jsonFile = `assets/config.json`;
    return this.http.get(jsonFile).toPromise()
      // .then(res => console.log(res))
      .catch(rej => console.log(rej));
  }

  getUser(): User {
    return this.user
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }
  getClaims(): any {
    return this.user.profile;
  }
  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }
  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.load()
      .then((res: UserManagerSettings) => {
        console.log(res);
        this.manager = new UserManager(res);
        return this.manager.signinRedirectCallback()
      })
      .then(user => {
        this.user = user;
      });

  }
  logout() {
    this.manager.signoutRedirect()
  }
}

// new Oidc.UserManager({ response_mode: "query" }).signinRedirectCallback().then(function () {
//   window.location = "index.html";
// }).catch(function (e) {
//   console.error(e);
// });
