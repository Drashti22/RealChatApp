import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from 'src/app/Services/auth.service';
import { MessagesService } from 'src/app/Services/messages.service';

interface Message {
  id: number,
  senderId: string,
  receiverId: string,
  content: string,
  timestamp: string,
  isEditing: boolean;


}

@Component({
  selector: 'app-message-history',
  templateUrl: './message-history.component.html',
  styleUrls: ['./message-history.component.css']
})

export class MessageHistoryComponent implements OnInit {
  messages!: Message[];
  newMessage: string = '';
  // loggedInUserId: string | null = null;
  sendForm: FormGroup | undefined;
  editForm!: FormGroup;

  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuVisible = false;
  contextMenuMessage: Message | null = null;
  

  loggedInUserId = this.auth.getLoggedInUserId();
  messagesFound: boolean = false;

  private beforeTimestamp: string | null = null;
  private isLoading = false;
  private isEndOfMessages = false;
  private connection!: HubConnection;
  messageArray = this.message.messageArray;


  constructor(private message: MessagesService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private form: FormBuilder) { }
    
  //get messages
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.message.receiverId = userId;
      this.getMessages();

    })
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

    
      this.connection.on('BroadCast', (message) => {
        console.log("Inside conncection")
      message.id = message.messageID;
      console.log(message.messageID);
      console.log("Before Push:", this.messageArray);
      this.messages.push(message);
      console.log("after Push:", this.messageArray);
      console.log(message.id);
      console.log(this.messageArray);
      this.getMessages();
    })
    this.sendForm = this.form.group({
      message: ['', Validators.required]
    });
    this.editForm = this.form.group({
      editedMessage: ['', Validators.required]
    })
  }
  getMessages() {
      if(this.message.receiverId != null){
        this.message.getConversationHistory(this.message.receiverId).subscribe((res => {
          if (res.messages) {
            console.log(res,1)
            const ascendingMessages = res.messages;
            this.messages = ascendingMessages;
          //  this.messages.push(...ascendingMessages);
            this.messagesFound = true;
            // this.scrollToBottom();
            setTimeout(() => {
              this.scrollToBottom();
            });   
          }
          else {
            this.messages = [];
            this.messagesFound = false;
          }
          console.log(res)
        }));
      }  
  }
  getMessageClasses(message: any): any {
    const loggedInUserId = this.auth.getLoggedInUserId();
    return {
      'messageBox': true,
      'sentClass': message.senderId === loggedInUserId,
      'receivedClass': message.senderId !== loggedInUserId
    };
  }

  //sending messages
  sendMessage() {
    if (this.message.receiverId && this.newMessage.trim() !== '') {
      const loggedInUserId = this.auth.getLoggedInUserId();
      console.log(loggedInUserId)
      if (loggedInUserId !== null) {
        const userId = this.message.receiverId || '-1';
        this.messagesFound = true;

        this.message.sendMessage(loggedInUserId, userId, this.newMessage).subscribe(
          (res: any) => {
            if (this.message.selectedUser) {
              if (!this.message.selectedUser.messages) {
                this.message.selectedUser.messages = [];
              }
              this.message.selectedUser.messages.push(res.newMessage);
              this.messagesFound = true;
              // this.scrollToBottom();
              console.log(this.messagesFound)

            }
            this.message.getConversationHistory(userId).subscribe((res => {
              const ascendingMessages = res.messages;
              this.messages = ascendingMessages;
              // this.messages.push(...ascendingMessages);
              console.log(res)
              this.newMessage = '';
              // this.scrollToBottom();
              setTimeout(() => {
                this.scrollToBottom();
              });
              
            }));
           
          },
          error => {
            console.error(error);
          }
        );
      } else {
        console.error('Logged in user ID is null');
      }
    }
  }

  //open context menu
  openContextMenu(event: MouseEvent, selectedMessage: any) {
    event.preventDefault();
    console.log(selectedMessage.senderId)
    console.log(this.loggedInUserId)
    if (selectedMessage.senderId == this.loggedInUserId) {
      this.contextMenuX = event.clientX;
      this.contextMenuY = event.clientY;
      this.contextMenuVisible = true;
      this.contextMenuMessage = selectedMessage;
    }
  }

  //close context menu
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  @HostListener('document: click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.contextMenuVisible) return;
    this.closeContextMenu();
  }

  //editting messages
  onEdit() {

    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = true;
      this.editForm.patchValue({ editedMessage: this.contextMenuMessage.content });
    }
    this.closeContextMenu
  }

  //edit
  onSave() {
    if (this.contextMenuMessage !== null && this.contextMenuMessage.id !== null) {
      const userId = this.message.receiverId;
      if (userId !== null) {
        this.message.editMessage(this.contextMenuMessage.id, this.editForm.value.editedMessage)
          .subscribe(res => {
            console.log(res)
            // this.contextMenuMessage!.content = this.editForm.value.editedMessage;
            // this.contextMenuMessage!.isEditing= false;


            this.message.getConversationHistory(userId).subscribe((res => {
              const ascendingMessages = res.messages;
              this.messages = ascendingMessages;
              // this.messages.push(...ascendingMessages);
              console.log(res)
              this.editForm.reset('');
              setTimeout(() => {
                this.scrollToBottom();
              });
              
            }));
          })
      }
      else {
        console.error("error")
      }
    }
  }
  onCancel() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = false;
    }
    this.closeContextMenu();
  }

  //deleting messages
  onDelete() {
    if (this.contextMenuMessage !== null) {
      const userId = this.message.receiverId;
      if (userId !== null) {
        this.message.deleteMessage(this.contextMenuMessage.id).subscribe(res => {
          this.message.getConversationHistory(userId).subscribe((res => {
            if (res.messages != null) {
              const ascendingMessages = res.messages;
              this.messages = ascendingMessages;
              // this.messages.push(...ascendingMessages);
              console.log(res)
              this.messagesFound = this.messages.length > 0;
            } else {
              this.messagesFound = false
            }
            setTimeout(() => {
              this.scrollToBottom();
            });
            
          }));
        })
      }
    }
  }

  scrollToBottom() {
    const messageContainer = document.querySelector('.ConversationHistory');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }
  
  loadMessages() {

    // alert("1 alert")
    if (!this.isLoading || !this.isEndOfMessages && this.message.receiverId != null ) {
      console.log("loading more messages")
      this.isLoading = true;
      const receiverId = this.message.receiverId;
    // alert("2 alert")
    if (this.messages.length > 0) {
      this.beforeTimestamp = this.messages[this.messages.length - 1].timestamp;
    }
      
      const scrollContainer = document.querySelector('.ConversationHistory');
      const scrollOffset = scrollContainer ? scrollContainer.scrollHeight - scrollContainer.scrollTop : 0;


      this.message.getConversationHistory(receiverId, this.beforeTimestamp).subscribe((res: any) => {
        if(Array.isArray(res.messages)){
        const olderMessages = res.messages.map((msg: Message) => ({
          ...msg,
          isEditing: false,
        })).reverse();
        if (olderMessages.length > 0) {
          this.messages = [ ...this.messages, ...olderMessages];
          console.log(this.messages)
          this.beforeTimestamp = olderMessages[olderMessages.length - 1].timestamp;
          console.log(this.beforeTimestamp)
        } 
        if (scrollContainer) {
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollOffset;
          });
        }
        else {
          this.isEndOfMessages = true;
        }
      }else{
        console.error("response is not an array:", res)
      }
        this.isLoading = false;
      });
    }
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: Event){
    console.log('Scroll event detected');
    const element = event.target as HTMLElement;
    if(element.scrollTop === 0){
      this.loadMessages()
    }
  }
}


