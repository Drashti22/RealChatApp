import { Component, OnInit, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NgToastService } from 'ng-angular-popup';
import { GroupService } from 'src/app/Services/group.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

export interface AddMemberReqDTO {
  MembersToAdd: string[];
  MembersToRemove: string[];
  includePreviousChat: boolean;
}
interface User{
  id: string;
  name: string;
}
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit{
  public users: User[] = [];
  selectedUsers: string[] = [];
  groupId: number = 0;
  initialSelectedUsers!: string[] ;
  wasInitiallySelected: boolean = false;
  includePreviousChat: boolean = false;
  connection!: HubConnection;
  

constructor(private user: UserService, 
            private group: GroupService, 
            private route: ActivatedRoute,
            private dialog: MatDialog,
            private toast: NgToastService,
            private shared: SharedService,
            @Inject(MAT_DIALOG_DATA) private dialogData: any
            ){}
ngOnInit(): void {
  this.groupId = this.dialogData.groupId
  const localToken = localStorage.getItem('auth_token');
  this.connection = new HubConnectionBuilder()
  .withUrl(`https://localhost:7132/chat/hub?access_token=${localToken}`)
  .build();
  this.connection.start()
      .then(() =>
        console.log('conn start'))
        
      .catch(error => {
        console.log(error)
      });
      console.log('Before connection.on');
  this.connection.on('GroupMembersUpdated', (groupMembers: string[]) => {
    try{
    console.log('Received Group Members Update:', groupMembers);

    console.log(this.groupId, this.selectedUsers);
    this.manageMembersToGroup(this.groupId, this.selectedUsers)
    }
    catch(error){
      console.error('Error handling GroupMembersUpdated event:', error);
    }
  });
  console.log('after connection.on');


  this.user.getUsers().subscribe(
    (res) => {
      this.users = res.users;
      console.log('Fetched users:', this.users); 
      
      console.log('selected Users:',this.selectedUsers)
      // console.log('Initial Selected Users:', this.initialSelectedUsers);
      // After fetching users, fetch the group members
      this.group.getGroupInfo(this.groupId).subscribe(
        (response) => {
          console.log(response)
          const groupMembers = response.members || [];

          // Populate the selectedUsers array based on group membership
          this.selectedUsers = this.users
            .filter((userItem) => groupMembers.includes(userItem.name))
            .map((userItem) => userItem.id);
            console.log('Selected users:', this.selectedUsers); 

            this.initialSelectedUsers = [...this.selectedUsers];
            console.log('Initial Selected Users:', this.initialSelectedUsers);
        },
        (error) => {
          console.error(error);
        }
      );
      
    },
    (error) => {
      console.error(error);
    }
    
  );
  this.group.groupDetailsChanged.subscribe((res) => {
    console.log(res)
  });
  
}
toggleUserSelection(userId: string): void {
  const isSelected = this.selectedUsers.includes(userId);
  if (isSelected) {
    // Deselect the user
    this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
  } else {
    // Select the user
    this.selectedUsers.push(userId);
  }
  this.wasInitiallySelected = this.initialSelectedUsers.includes(userId) && !isSelected;
  console.log('Toggle User Selection - User ID:', userId);
    console.log('Selected Users:', this.selectedUsers);
    console.log('Was Initially Selected:', this.wasInitiallySelected);
  // this.initialSelectedUsers = [...this.selectedUsers];
  if (this.wasInitiallySelected) {
    // User was initially selected and is now being deselected, so remove them from initialSelectedUsers
    this.initialSelectedUsers = this.initialSelectedUsers.filter((id) => id !== userId);
  } else if (!isSelected) {
    // User was initially not selected and is now being selected, so add them to initialSelectedUsers
    this.initialSelectedUsers.push(userId);
  }

}
toggleIncludePreviousChat(): void {
  this.includePreviousChat = !this.includePreviousChat;
}
manageMembersToGroup(groupId: number, selectedUserIds: string[]): void {
  
  if (!this.groupId) {
    console.error('Group ID is missing.');
    return;
  }
  console.log('Group ID:', groupId);
  console.log('Group Members:', selectedUserIds);
  console.log('Add Members - Initial Selected Users:', this.initialSelectedUsers);

  
  // const membersToRemove = this.initialSelectedUsers.filter((id) => !selectedUserIds.includes(id));
  const membersToRemove = this.initialSelectedUsers.filter((id) => {
    const shouldRemove = !selectedUserIds.includes(id);
    console.log(`User ID: ${id}, Should Remove: ${shouldRemove}`);
    return shouldRemove;
  });
  
  console.log('Group Members to Remove:', membersToRemove);
  const requestPayload: AddMemberReqDTO = {
    MembersToAdd: selectedUserIds,
    MembersToRemove: membersToRemove,
    includePreviousChat: this.includePreviousChat
  };
  console.log('Add Members - Request Payload:', requestPayload);
  this.group.addMembers(groupId, requestPayload).subscribe(
    (response) => {
      console.log('Members added to group:', response);
      
      this.toast.success({detail: "SUCCESS", summary:"Members Updated ", duration: 2000});
      this.shared.setGroupDetails(response); 
      console.log('Updated Group Details:', response)
      this.shared.triggerGroupDetailsChanged(); 
      this.shared.setAddMembersRequest(requestPayload);
    },
  (error)=>{
    console.error('Error adding members to group:', error);
    this.toast.error({detail: "ERROR", summary:"You cannot remove the admin of the group. ", duration: 2000});
  }
  ); 
  this.dialog.closeAll();
}
}
