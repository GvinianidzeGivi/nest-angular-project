import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, tap, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Hotel } from '../../model/hotel.interface';

export interface LoginForm {
  name?: string;
  email: string;
  password: string;
};

export const JWT_NAME = 'blog-token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public myData:any = new BehaviorSubject([]);

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }


  loginCustomer(loginForm: LoginForm) { 
    this.myData.next('customers');

    localStorage.setItem('user', 'customers')

    return this.http.post<any>(`/api/auth/login/customer`, {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {   
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    )
  }

  login(loginForm: LoginForm) { 
    localStorage.setItem('user', 'hotels')
    this.myData.next('hotels');
    return this.http.post<any>('/api/auth/login/hotel', {name: loginForm.name, email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {        
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    )
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
  }

  register(hotel: Hotel, activeReg) {
    return this.http.post<any>(`/api/${activeReg}/register`, hotel).pipe(
      tap(user => console.log(user)),
      map(user => user)
    )
  }


  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }
  
  getUserId(): Observable<number>{
    let token = localStorage.getItem('blog-token')
    return of(localStorage.getItem(JWT_NAME)).pipe(
      switchMap((jwt: string) => of(this.jwtHelper.decodeToken(token)).pipe(
        map((jwt) => jwt[Object.keys(jwt)[0]].id))
      )
    )
  }

}
