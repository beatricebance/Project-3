import { Injectable } from "@angular/core";
import { AbstractSocketService, ROOM_EVENT_NAME } from "src/app/shared";
import {
  CHAT_NAMESPACE_NAME,
  TEXT_MESSAGE_EVENT_NAME,
} from "../constants/socket.constant";
import { Message } from "../models/message.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatSocketService extends AbstractSocketService {
  chatSubject: Subject<Message>;
  messageHistory: Subject<Message[]>;

  constructor() {
    super();
    this.init();
  }

  protected init(): void {
    super.init(CHAT_NAMESPACE_NAME);
    this.chatSubject = new Subject<Message>();
    this.messageHistory = new Subject<Message[]>();
  }

  sendMessage(message: Message): void {
    this.emit(TEXT_MESSAGE_EVENT_NAME, message);
  }

  protected setSocketListens(): void {
    this.listenMessage();
    this.listenHistory();
  }

  private listenMessage(): void {
    this.namespaceSocket.on(TEXT_MESSAGE_EVENT_NAME, (message: Message) => {
      this.chatSubject.next(message);
    });
  }

  private listenHistory(): void {
    this.namespaceSocket.on(ROOM_EVENT_NAME, (history: Message[]) => {
      this.messageHistory.next(history);
    });
  }
}
