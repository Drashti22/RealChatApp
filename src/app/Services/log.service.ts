import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private baseUrl: string = "https://localhost:7132/api/Log/"
  constructor(private http: HttpClient) { }
  
  getLogs(startTime: string, endTime: string){
    const params = { startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString() };
    return this.http.get<any[]>(`${this.baseUrl}log`, { params });
  }
}
