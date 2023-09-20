import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../authentication";
import { User } from "../users/models/user";
import { UsersService } from "../users/services/users.service";
import { Message } from "./models/message.model";
import { TextChannel } from "./models/text-channel.model";
import { ChatSocketService } from "./services/chat-socket.service";
import { ChatService } from "./services/chat.service";
// import { TextChannelService } from "./services/text-channel.service";

@Component({
  selector: "chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
// tslint:disable: no-non-null-assertion
export class ChatComponent implements OnInit, OnDestroy {
  user: User | null;
  chatSubscription: Subscription;
  @ViewChild("chatBox", { static: false })
  private chatBox: ElementRef<HTMLInputElement>;

  message = "";
  // saves connected rooms and message history from connection
  messageHistory: Map<string, Message[]> = new Map();

  isMinimized = false;
  isPopoutOpen = false;
  loadedHistory = false;

  currentChannel: TextChannel | null;

  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
    private chatSocketService: ChatSocketService,
    private chatService: ChatService,
    // private textChannelService: TextChannelService,
    private ref: ChangeDetectorRef
  ) {
    this.currentChannel = {
      _id: "default",
      name: "General",
      ownerId: "default"
    }
  }

  ngOnInit(): void {
    this.usersService.getUser(localStorage.getItem("userId")!).subscribe((user) => {
      this.user = user;
    });
    this.authService.currentUserObservable.subscribe((user) => {
      if(!user) {
        this.closeChat()
        this.closeChatPopout();
      }
    })
    this.openChatRoom();
    this.receiveMessage();
    this.leaveRoom();
    this.chatSocketService.connect();
  }

  ngOnDestroy(): void {
    this.messageHistory.forEach((_messages, roomName) => {
      this.chatSocketService.leaveRoom({
        userId: this.user!._id!,
        roomName: roomName,
      });
    });
    this.chatSocketService.disconnect();
    this.chatSubscription.unsubscribe();
    this.closeChat();
    this.closeChatPopout();
  }

  openChatRoom() {
    // might want to run these in parallel (fork?)
    this.chatService.toggleChatOverlay.subscribe((channel) => {
      this.currentChannel = channel;
      if (!this.isPopoutOpen) {
        const chat = document.getElementById("chat-popup") as HTMLInputElement;
        chat.style.display = "block";
        this.minimizeChat(false);
      }
      this.scrollDown();
      this.joinRoom(channel.name);
    });
  }

  joinRoom(channelName: string) {
    if (!this.messageHistory.has(channelName)) {
      this.messageHistory.set(channelName, new Array());
      this.chatSocketService.joinRoom({
        userId: this.user?._id!,
        roomName: channelName,
      });
      this.chatSocketService.messageHistory.subscribe((history) => {
          if (!history) return;
          this.messageHistory.set(
            history[0].roomName,
            history,
          );
        },
      );
    }
  }

  leaveRoom() {
    this.chatService.leaveRoomEventEmitter.subscribe((channel) => {
      this.messageHistory.delete(channel.name);
      this.chatSocketService.leaveRoom({
        userId: this.user?._id!,
        roomName: channel.name,
      });
      this.currentChannel = null;
      this.closeChat();
      this.closeChatPopout();
    });
  }

  receiveMessage() {
    // appends every message from every roomname
    this.chatSubscription = this.chatSocketService.chatSubject.subscribe({
      next: (message) => {
        this.joinRoom(message.roomName);
        if (!this.messageHistory.get(message.roomName)?.includes(message)) {
          this.messageHistory.get(message.roomName)?.push(message);
        }
        this.scrollDown();
      },
    });
  }

  scrollDown() {
    const messageBox = this.chatBox.nativeElement;
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  sendMessage() {
    if (this.message === null || this.message.match(/^ *$/) !== null) return;

    if (this.user?.username === null) return;
      const message: Message = {
        message: this.message,
        timestamp: new Date(),
        author: this.user?.username!,
        roomId: this.currentChannel?._id!,
        roomName: this.currentChannel?.name!,
      };
      this.chatSocketService.sendMessage(message);
      this.message = "";
  }

  minimizeChat(isMinimized: boolean) {
    this.isMinimized = isMinimized;
  }

  closeChat() {
    const chat = document.getElementById("chat-popup") as HTMLInputElement;
    chat.style.display = "none";
    this.currentChannel = null;
    this.loadedHistory = false;
  }

  openChatPopout() {
    this.isPopoutOpen = true;
  }

  closeChatPopout(_isOut?: boolean) {
    this.isPopoutOpen = false;
    this.ref.detectChanges();
  }

  getMessageClass(author: string): string {
    if (this.user?.username === author) return "user";
    else return "other";
  }

  getMessages(): Message[] {
    if (!this.messageHistory.has(this.currentChannel?.name!)) {
      return [];
    }
    const messageArray = this.messageHistory.get(this.currentChannel?.name!) as Message[];
    if (!this.loadedHistory) {
      const loginTimeIndex =
        messageArray.findIndex((message) => new Date(message.timestamp).getTime() >= new Date(this.user?.lastLogin!).getTime())!;
      if (loginTimeIndex === 0) {
        this.loadedHistory = true;
        this.ref.detectChanges();
      }
      const messagesFromConnection = messageArray.slice(loginTimeIndex === -1 ? messageArray.length: loginTimeIndex);
      return messagesFromConnection!;
    }
    const messages = this.messageHistory.get(this.currentChannel?.name!);
    return messages!;
  }
}
