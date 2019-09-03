import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BlogService} from '../shared/blog.service';
import {Token} from '../shared/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private data: BlogService) { }

  /**
   * this is used to clear anything that needs to be removed
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * check for expiration and if token is still existing or not
   * @return {boolean}
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    return false;
  }


  login(token: Token): void {
    localStorage.setItem('token', token.accessToken);
    if (token.id) {
      localStorage.setItem('user', token.id);
    }
    this.router.navigate(['/dashboard']);
  }

  /**
   * this is used to clear local storage and also the route to login
   */
  logout(): void {
    this.clear();
    this.data.removeUser();
    this.router.navigate(['/login']);
  }

}
