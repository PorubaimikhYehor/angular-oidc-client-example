import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

export function getClientSettings(): UserManagerSettings {
  return {
    authority: "http://localhost:5000",
    client_id: "spa",
    redirect_uri: "http://localhost:5003/callback.html",
    response_type: "code",
    scope: "openid profile api1",
    post_logout_redirect_uri: "http://localhost:5003/index.html",
    response_mode: "query",

    // authority: 'http://localhost:5000/',
    // client_id: 'js',
    // redirect_uri: 'http://localhost:5003/callback',
    // post_logout_redirect_uri: 'http://localhost:5003/',
    // response_type: "code",
    // scope: "openid profile api1",
    // filterProtocolClaims: true,
    // loadUserInfo: true
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {

    this.manager.getUser().then(user => {
      this.user = user;
    });

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
    return this.manager.signinRedirectCallback().then(user => {
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
