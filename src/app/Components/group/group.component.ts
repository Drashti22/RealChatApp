import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { GroupService } from 'src/app/Services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit{
  public groups: any = []
  constructor(public dialog: MatDialog, public group: GroupService) { }
  ngOnInit(): void {
  
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
  
}


