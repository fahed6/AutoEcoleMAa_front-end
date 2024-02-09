import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly PATH_OF_API = 'http://localhost:8080';

  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserAuthService
  ) {console.log('AuthInterceptor initialized');}

  public login(loginData: any): Observable<any> {
    return this.httpClient.post(`${this.PATH_OF_API}/authenticate`, loginData);
  }

  public forUser(): Observable<string> {
    return this.makeAuthenticatedRequest('/forUser');
  }

  public forAdmin(): Observable<string> {
    return this.makeAuthenticatedRequest('/forAdmin');
  }

  private makeAuthenticatedRequest(endpoint: string): Observable<string> {
    console.log('Making Authenticated Request');
  const token = this.userAuthService.getToken();
  console.log('Requesting with Token:', token); // Add this line
  const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

  return this.httpClient.get(`${this.PATH_OF_API}${endpoint}`, {
    headers,
    responseType: 'text',
  });
}
  public roleMatch(allowedRoles: string | any[]): boolean {
    const userRoles: any = this.userAuthService.getRoles();

    if (userRoles != null && userRoles) {
      for (const userRole of userRoles) {
        if (allowedRoles.includes(userRole.roleName)) {
          return true;
        }
      }
    }

    return false;
  }
}
