import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  register(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);
  
    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_email', credentials.username);
          localStorage.setItem('user_id', response.user_id);
          if (response.username) {
            localStorage.setItem('username', response.username);
          }
          this.authState.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    this.authState.next(false);
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getCurrentUser(): User | null {
    const userId = this.getUserId();
    const email = this.getUserEmail();
    const username = this.getUsername() || "Unknown"; 
  
    if (userId && email) {
      return { id: userId, email: email, username: username };
    }
    return null;
  }
}