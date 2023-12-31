import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable } from 'rxjs';

interface Message {
  id: number,
  senderId: string,
  receiverId: string,
  content: string,
  timestamp: string,
  isEditing: boolean;


}
@Injectable({
  providedIn: 'root'
})

export class MessagesService {
  private baseUrl: string = "https://localhost:7132/api/Message/"
  constructor(private http: HttpClient) { }

  selectedUser: any = null;
  receiverId!: string ;
  private chatConnection? : HubConnection;
  messageArray: Message[]= [] ;

  getConversationHistory(userId: string, beforeTimestamp?: string | null): Observable<any> {
    let url = `${this.baseUrl}messages?userId=${userId}`;
    if (beforeTimestamp) {
      url += `&before=${beforeTimestamp}`;
    }
    console.log(userId, beforeTimestamp)
    return this.http.get<any>(url);
  }
  sendMessage(senderId: string, receiverId: string, content: string){
    const message = {
      // senderId: senderId,
      receiverId: receiverId,
      content: content
    };
    return this.http.post(`${this.baseUrl}messages`, message);
  }
  
  editMessage(messageId: number, content: string): Observable<any> {
    const editedMessages = {
      content: content
    }
    console.log(editedMessages)
    return this.http.put(`${this.baseUrl}messages/messageId?messageId=${messageId}`, editedMessages)
    
  }
  deleteMessage(messageid: number){
    return this.http.delete<any>(`${this.baseUrl}messages/${messageid}`)
  }
  getAdditionalMessages(receiverId: number, beforeTimestamp: string, limit: number): Observable<any> {
    console.log(receiverId, beforeTimestamp, limit)
    let url = `${this.baseUrl}messages?userId=${receiverId}&before=${beforeTimestamp}&limit=${limit}`;
    
    return this.http.get<any>(url);
  }
  searchMessage(keyword: string){
    console.log("Keyword:" ,keyword)
    return this.http.get(`${this.baseUrl}search?keyword=${keyword}`)
  }
  // createChatConnection(){
  //   this.chatConnection = new HubConnectionBuilder()
  //   .withUrl(`${}`) 
  // }  
}
