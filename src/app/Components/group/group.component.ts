import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { GroupService } from 'src/app/Services/group.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit{
  public groups: any = []
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuVisible = false;
  connection!: HubConnection;

  constructor(public dialog: MatDialog, public group: GroupService) { }
  ngOnInit(): void {
    const localToken = localStorage.getItem('auth_token');
  this.connection = new HubConnectionBuilder()
    .withUrl(`https://localhost:7132/chat/hub?access_token=${localToken}`)
    .build();

  this.connection.start()
    .then(() => {
      console.log('conn start');
      this.connection.on('GroupMembersUpdated', (groupMembers: string[]) => {
        try {
          console.log('Received Group Members Update:', groupMembers);
          this.group.GetGroupList().subscribe(res => {
            this.groups = res;
            console.log(res);
          },
          (error) => {
            console.error(error);
          });
        }
        catch (error) {
          console.error('Error handling GroupMembersUpdated event:', error);
        }
      });
    })
    .catch(error => {
      console.log(error);
    });
   this.group.GetGroupList().subscribe(res=>{
    this.groups = res
    console.log(res);
   },
   (error)=>{
    console.error(error)
   }
   );
  
   this.group.groupAdded().subscribe(() => {
    this.group.GetGroupList().subscribe(res=>{
      this.groups = res
     },
     (error)=>{
      console.error(error)
     }                                                          
     );
  });
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


