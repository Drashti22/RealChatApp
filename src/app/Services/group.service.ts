import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { AddMemberReqDTO } from '../Components/user-dialog/user-dialog.component';
import { HubConnection } from '@microsoft/signalr';
interface Member{
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  private baseUrl: string = "https://localhost:7132/api/Group";
  public groupAddedSubject: Subject<void> = new Subject<void>();
  public groupDetailsChanged: Subject<void> = new Subject<void>();

  private groupListSubject = new BehaviorSubject<any[]>([]);
  groupList$: Observable<any[]> = this.groupListSubject.asObservable();
  private groupDetails: any;
  hubConnection!: HubConnection;
  constructor(private http: HttpClient) {
    
   }

  addGroup(grpObj: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}`, grpObj)
    .pipe(
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
  updateGroupList(groups: any[]) {
    this.groupListSubject.next(groups);
  }

  getGroupList(): any[] {
    return this.groupListSubject.value;
  }
  GetConverSationHistory(groupid: number){
    
    return this.http.get<any>(`${this.baseUrl}/${groupid}/messages`)
  }
  sendMessage(groupId: number, content: string){
    const message = {
      groupId: groupId,
      content: content
    }
    return this.http.post<any>(`${this.baseUrl}/${groupId}/messages`, message)
  } 
  addMembers(groupId: number, requestPayload: AddMemberReqDTO): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/groups/${groupId}/members`, requestPayload).pipe(
      tap((res)=>{
        console.log('Members added to group:', res);
      }
      )
    )
  }
  getGroupInfo(groupId: number){
    return this.http.get<any>(`${this.baseUrl}/${groupId}`)
  }
  deleteGroup(groupId: number){
    return this.http.delete<any>(`${this.baseUrl}/${groupId}`)
  }
  onReceiveGroupUpdate(callback: (groupId: number) => void): void {
   
      this.hubConnection.on('ReceiveGroupUpdate', callback);
   
  }
}
