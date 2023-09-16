import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
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
  private connection!: HubConnection;
  messages = this.message.messageArray;

  constructor(private auth: AuthService, 
              private route: Router, 
              private user: UserService, 
              private message: MessagesService, 
              private form: FormBuilder, 
              private socialService: SocialAuthService) {}
                                          

  ngOnInit(): void {
    this.searchForm = this.form.group({
      search: ['', Validators.required]
    });
    // const localToken = localStorage.getItem('auth_token');
    // this.connection = new HubConnectionBuilder()

    //   .withUrl(`https://localhost:7132/chat/hub?access_token=${localToken}`)
    //   .build();

    // this.connection.start()
    //   .then(() =>
    //     console.log('conn start'))
        
    //   .catch(error => {
    //     console.log(error)
    //   });

    
    //   this.connection.on('BroadCast', (message) => {
    //     console.log("Inside conncection")
    //   message.id = message.messageID;
    //   console.log(message.messageID);
    //   console.log("Before Push:", this.messages);
    //   this.messages.push(message);
    //   console.log("after Push:", this.messages);
    //   console.log(message.id);
    //   console.log(this.messages);
    // })
  }
  onLogout() {
    this.socialService.signOut();
    this.auth.removeToken()
    this.route.navigate(['login'])
  }
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
