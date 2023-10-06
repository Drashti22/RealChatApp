import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AddMemberReqDTO } from '../Components/user-dialog/user-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private groupDetailsChangedSubject: Subject<void> = new Subject<void>();
  private addMembersRequest = new BehaviorSubject<AddMemberReqDTO | null>(null);
  groupDetailsChanged$ = this.groupDetailsChangedSubject.asObservable();

  private groupListSubject = new BehaviorSubject<any[]>([]);
  groupList$: Observable<any[]> = this.groupListSubject.asObservable();
  private groupDetails: any;
  constructor() { }
  triggerGroupDetailsChanged() {
    this.groupDetailsChangedSubject.next();
  }
  setGroupDetails(details: any) {
    this.groupDetails = details;
  } 

  getGroupDetails() {
    return this.groupDetails;
  }
  get addMembersRequest$() {
    return this.addMembersRequest.asObservable();
  }

  setAddMembersRequest(request: AddMemberReqDTO) {
    this.addMembersRequest.next(request);
  }
  
  
}


