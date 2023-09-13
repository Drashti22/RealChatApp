import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { MessagesService } from 'src/app/Services/messages.service';
import { UserService } from 'src/app/Services/user.service';
    

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{
  public users:any = [ ];
  // @Output() openMessageHistory = new EventEmitter<any>();
constructor(private auth: AuthService, private route: Router, private user: UserService, private message: MessagesService ){}

ngOnInit(){
  this.user.getUsers()
  .subscribe(res=>{
    this.users = res.users;
  },
  (error)=>{
    console.error(error);
  }
  );
}
// onUserClick(user: any) {
//   console.log('Emitting openMessageHistory event for user:', user);
//   this.message.selectedUser = user;
//   // this.openMessageHistory.emit(user);
// }


}
