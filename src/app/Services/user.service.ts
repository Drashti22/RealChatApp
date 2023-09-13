import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string ='https://localhost:7132/api/user/';
  constructor(private http: HttpClient) { }

  getUsers(){
    return this.http.get<any>(`${this.baseUrl}users`)
  }
  
}
