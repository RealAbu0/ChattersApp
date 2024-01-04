import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, pipe } from 'rxjs';
import { WebSocketSubject, webSocket} from 'rxjs/webSocket'
import { MessageEventType } from 'src/app/enum/message-event-type';
import { ChatMessageEvent } from 'src/app/models/chat-message-event';
import { ApiServiceService } from 'src/app/service/api/api-service.service';
import { AuthServiceService } from 'src/app/service/auth/auth-service.service';
import { UserStoreServiceService } from 'src/app/service/userstore/user-store-service.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-room-page',
  templateUrl: './chat-room-page.component.html',
  styleUrls: ['./chat-room-page.component.scss']
})
export class ChatRoomPageComponent implements OnInit {

  webSocket!: WebSocketSubject<ChatMessageEvent>;

  chatMessageInput = '';
  username!: string;

  chatUserBoxName = '';
  message = '';
  allMessages: string[] = [];

  users: string[] = [];

  roomId = '';

  webSocketUrl = 'ws://localhost:5182';

  messageForm!: FormGroup

  constructor(private apiService: ApiServiceService, private authService: AuthServiceService, private currentRoute: ActivatedRoute,
    private storeService: UserStoreServiceService, private fb: FormBuilder) {

    this.currentRoute.params.subscribe(p => {
      this.roomId = p['roomId'];
    });

   }

  ngOnInit(): void {

    this.storeService.getUserName().subscribe(res => {
      let getUserNameFromToken = this.authService.getUserNameFromToken();
      this.username = res || getUserNameFromToken;
    });

    this.messageForm = this.fb.group({
      msgInput: ['', Validators.required]
    });

    
    
    this.webSocketInit();

    
    
  }

  private webSocketInit(){
    const webSocketUrl = this.webSocketUrl + "/?username=" + this.username + "&room=" + this.roomId;

    this.webSocket = webSocket<ChatMessageEvent>(webSocketUrl);

    console.log(this.webSocket);
    
    this.webSocket.subscribe(value => {
      this.events(value);
    })
  }

  private events(chatEvent: ChatMessageEvent){
 
    

    if(chatEvent.messageEventType == MessageEventType.Message){
      this.allMessages.push(`${chatEvent.user}: ${chatEvent.message}`);
      this.chatUserBoxName = chatEvent.user;
    }
    else if(chatEvent.messageEventType == MessageEventType.Broadcast){
      this.allMessages.push(chatEvent.message);
      
      this.getRoomInfo();

    }
  }

  getRoomInfo(): void{
    this.apiService.getOneRoom(this.roomId).pipe(first()).subscribe(currentRoom => {
      this.users = [];

      currentRoom.users.forEach(x => this.users.push(x.username));
    });
  }

  sendMessage(msg: string){
    msg = this.messageForm.get('msgInput')?.value;
    this.message = msg;
    
    this.webSocket.next({messageEventType: MessageEventType.Message, message: msg, user: this.username});
    console.log(msg);
    this.allMessages.push(this.message);
    msg = '';
    this.message = '';
    this.messageForm.reset();
  }

}
