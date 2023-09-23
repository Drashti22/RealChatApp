import { Component, OnInit, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { GroupService } from 'src/app/Services/group.service';
import { UserService } from 'src/app/Services/user.service';

export interface AddMemberReqDTO {
  GroupMembers: string[];
}
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit{
  public users:any = [ ];
  selectedUsers: string[] = [];
  groupId: number = 0;
  
constructor(private user: UserService, 
            private group: GroupService, 
            private route: ActivatedRoute,
            private dialog: MatDialog,
            private toast: NgToastService,
            @Inject(MAT_DIALOG_DATA) private dialogData: any
            ){}
ngOnInit(): void {
  this.groupId = this.dialogData.groupId
  this.user.getUsers()
  .subscribe(res=>{
    this.users = res.users;
  },
  (error)=>{
    console.error(error);
  }
  );
}
toggleUserSelection(userId: string): void {
  if (this.selectedUsers.includes(userId)) {
    // Deselect the user
    this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
  } else {
    // Select the user
    this.selectedUsers.push(userId);
  }
}
addMembersToGroup(groupId: number, selectedUserIds: string[]): void {
  
  if (!this.groupId) {
    console.error('Group ID is missing.');
    return;
  }
  console.log('Group ID:', groupId);
  console.log('Group Members:', selectedUserIds);
  console.log('Request Payload:', { GroupMembers: selectedUserIds });
  const requestPayload: AddMemberReqDTO = {
    GroupMembers: selectedUserIds,
  };
  this.group.addMembers(groupId, requestPayload).subscribe(
    (response) => {
      console.log('Members added to group:', response);
      
      this.toast.success({detail: "SUCCESS", summary:"Member Added", duration: 2000});
    },
  (error)=>{
    console.error('Error adding members to group:', error);
  }
  ); 
  this.dialog.closeAll()

}
}
