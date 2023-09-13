import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { MessagesService } from 'src/app/Services/messages.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public users:any = [ ];
  selectedUser: any; 
  newMessage: string = '';
  constructor(private auth: AuthService, private route: Router, private user: UserService,private message: MessagesService  ){}


  onLogout(){
    this.auth.removeToken()
    this.route.navigate(['login'])
  }
//   openMessageHistory(user: any) {
//     this.selectedUser = user; // Store the selected user
//     console.log('Open message history for user:', user);
//     console.log('User ID:', user.id)
// }




}
