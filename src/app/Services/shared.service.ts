import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private groupDetailsChangedSubject: Subject<void> = new Subject<void>();
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

  
  
}


