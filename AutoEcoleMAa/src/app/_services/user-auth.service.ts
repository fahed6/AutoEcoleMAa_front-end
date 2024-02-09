import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private rolesSubject = new BehaviorSubject<{ roleName: string }[] | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public setRoles(roles: { roleName: string }[] | null) {
    this.rolesSubject.next(roles);
  }

  public getRoles(): { roleName: string }[] | null {
    return this.rolesSubject.value;
  }

  public setToken(jwtToken: string) {
    this.tokenSubject.next(jwtToken);
  }

  public getToken(): string | null {
    return this.tokenSubject.value;
  }

  public getTokenObservable() {
    return this.tokenSubject.asObservable();
  }

  public clear() {
    this.rolesSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

  public isAdmin() {
    const roles: { roleName: string }[] | null = this.getRoles();
    return roles && roles.length > 0 && roles[0].roleName === 'Admin';
  }

  public isUser() {
    const roles: { roleName: string }[] | null = this.getRoles();
    return roles && roles.length > 0 && roles[0].roleName === 'User';
  }
}
