import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { GroupService } from 'src/app/Services/group.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Router } from '@angular/router';

interface Group {
  id: number;
  groupName: string ;
  members: string[];
}
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit{
  public groups: Group[] = [];
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuVisible = false;
  connection!: HubConnection;

  constructor(public dialog: MatDialog, public group: GroupService, private cdr: ChangeDetectorRef, private router : Router,) { }
  ngOnInit(): void {
    const localToken = localStorage.getItem('auth_token');
  this.connection = new HubConnectionBuilder()
    .withUrl(`https://localhost:7132/chat/hub?access_token=${localToken}`)
    .build();

    this.connection.start().catch(error => console.error(error));

    this.connection.on('ReceiveGroupUpdate', (groupId: number) => {
      // Handle the group update here
      console.log(`Received group update for groupId: ${groupId}`);
      this.updateGroupList();
      this.router.navigate(['dashboard']);// Call the method to update the group list or do other actions
    });
    
   this.group.GetGroupList().subscribe(res=>{
    this.groups = res
    console.log(res);
   },
   (error)=>{
    console.error(error)
   }
   );
  //  this.group.groupAdded().subscribe(() => {
  //   this.updateGroupList();
  // });
  }
  updateGroupList(): void {
    this.group.GetGroupList().subscribe(
      res => {  
        this.groups = res;
        this.cdr.detectChanges(); // Manually detect changes to update the view
        console.log('Updated Group List:', res);
      },
      error => {
        console.error(error);
      }
    );
  }
  handleGroupMembersUpdated(groupId: number): void {
    // Handle the group members update for the specific group (e.g., refresh the members list)
    console.log(`Group members updated for groupId: ${groupId}`);
  }

    openDialog() : void{
      const dialogConfig: MatDialogConfig = {backdropClass: 'backdropBackground'};
      this.dialog.open(DialogBoxComponent, dialogConfig);
    }
    openContextMenu(event: MouseEvent, selectedGroup: any) {
      event.preventDefault();
      this.contextMenuX = event.clientX;
      this.contextMenuY = event.clientY;
      this.contextMenuVisible = true;
      selectedGroup: this.groups
    }
}


