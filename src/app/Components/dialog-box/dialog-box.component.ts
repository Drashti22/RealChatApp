import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/Services/group.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent {
  groupForm = new FormGroup({
    groupName: new FormControl()
  });
  
  constructor(private dialog: MatDialog, private group: GroupService){}
  closeDialog(): void {
    this.dialog.closeAll();
  }
  newGroup(): void{
    const groupName = this.groupForm.get('groupName')?.value;
    this.group.addGroup({GroupName: groupName}).subscribe((res)=>{
      console.log("new group created", res);
      this.dialog.closeAll();
      this.group.groupAddedSubject.next();

    },
     error=>{
      console.error('error creating a book', error)
    } 
    )
  }
}
