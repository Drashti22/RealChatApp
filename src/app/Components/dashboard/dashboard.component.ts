import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { MessagesService } from 'src/app/Services/messages.service';
import { UserService } from 'src/app/Services/user.service';


interface messageResponse{
  messages: any[];
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  selectedUser: any;
  newMessage: string = '';
  searchForm!: FormGroup
  Messages!: messageResponse['messages'];
  keyword!: string;
  showSearchResults: boolean = false;
  constructor(private auth: AuthService, 
              private route: Router, 
              private user: UserService, 
              private message: MessagesService, 
              private form: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.form.group({
      search: ['', Validators.required]
    });
  }
  onLogout() {
    this.auth.removeToken()
    this.route.navigate(['login'])
  }
  //   openMessageHistory(user: any) {
  //     this.selectedUser = user; // Store the selected user
  //     console.log('Open message history for user:', user);
  //     console.log('User ID:', user.id)
  // }

  searchMessage() {
    console.log("search")
    const keyword = this.searchForm.value.search
    if (keyword != null) {
      this.message.searchMessage(keyword)
        .subscribe((res: any) => {
          console.log(res)
          this.Messages = res.messages;
          this.showSearchResults = true;
          this.searchForm.reset();
        })
      }
  }
  onClose(){
    this.showSearchResults = false;
  }
  getMessageClasses(message: any): any {
    const loggedInUserId = this.auth.getLoggedInUserId();
    return {
      'messageBox': true,
      'sentClass': message.senderId === loggedInUserId,
      'receivedClass': message.senderId !== loggedInUserId
    };
  }
}
