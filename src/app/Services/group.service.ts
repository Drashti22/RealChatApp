import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  private baseUrl: string = "https://localhost:7132/api/Group"
  public groupAddedSubject: Subject<void> = new Subject<void>();
  constructor(private http: HttpClient) {
    
   }

  addGroup(grpObj: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}`, grpObj).pipe(
      tap(()=>{
        this.groupAddedSubject.next();
      })
    )
    
  }
  groupAdded(): Observable<void> {
    return this.groupAddedSubject.asObservable();
  }
  GetGroupList(){
    return this.http.get<any>(`${this.baseUrl}`)
  }
  GetConverSationHistory(groupid: number){
    return this.http.get<any>(`${this.baseUrl}`)
  }
}
