import { SocketServiceInterface } from '../../interfaces/socket.interface';
import { inject, injectable } from 'inversify';
import {
  CHAT_NAMESPACE_NAME,
  CONNECTION_EVENT_NAME,
  LEAVE_ROOM_EVENT_NAME,
  ROOM_EVENT_NAME,
  TEXT_MESSAGE_EVENT_NAME,
} from '../../constants/socket-constants';
import { Server, Socket } from 'socket.io';
import { TYPES } from '../../../domain/constants/types';
import { MessageRepository } from '../../../infrastructure/data_access/repositories/message_repository';
import { MessageInterface } from '../../../domain/models/Message';
import { TextChannelRepository } from '../../../infrastructure/data_access/repositories/text_channel_repository';
import { SocketRoomInformation } from '../../../domain/interfaces/socket-information';

@injectable()
export class ChatSocketService extends SocketServiceInterface {
  @inject(TYPES.MessageRepository) public messageRepository: MessageRepository;
  @inject(TYPES.TextChannelRepository)
  public textChannelRepository: TextChannelRepository;

  // messageHistory: Map<string, Set<MessageInterface>> = new Map();
  io: Server;

  init(io: Server) {
    this.io = io;
    this.namespace = io.of(CHAT_NAMESPACE_NAME);
    this.namespace.on(CONNECTION_EVENT_NAME, (socket: Socket) => {
      console.log(`${CHAT_NAMESPACE_NAME} socket user has connected.`);
      this.setSocketListens(socket);
    });
  }

  protected setSocketListens(socket: Socket) {
    this.listenMessage(socket);
    this.listenRoom(socket);
    this.listenLeaveRoom(socket);
    this.listenDisconnect(socket);
  }

  private listenMessage(socket: Socket): void {
    socket.on(TEXT_MESSAGE_EVENT_NAME, (message: MessageInterface) => {
      console.log(
        `${message.author} at ${message.timestamp}: ${message.message}`,
      );
      this.emitMessage(message);
      
      this.textChannelRepository
      .getChannelByName(message.roomName)
      .then((channel) => {
        this.textChannelRepository.getMessages(channel._id)
        .then((messages) => {
          if (messages && messages.length !== 0){
            this.emitHistory(message.roomName, messages);
          }
        })
      })

      this.messageRepository.storeMessages(message);
    });
  }

  private emitMessage(message: MessageInterface): void {
    this.namespace.to(message.roomName).emit(TEXT_MESSAGE_EVENT_NAME, message);
  }

  protected listenRoom(socket: Socket) {
    socket.on(ROOM_EVENT_NAME, (socketInformation: SocketRoomInformation) => {
      console.log(
        `${socketInformation.userId} has joined room ${socketInformation.roomName}`,
      );
      socket.join(socketInformation.roomName);

      this.textChannelRepository
      .getChannelByName(socketInformation.roomName)
      .then((channel) => {
        this.textChannelRepository.getMessages(channel._id)
        .then((messages) => {
          if (messages && messages.length !== 0){
            this.emitHistory(socketInformation.roomName, messages);
          }
        })
      })
      
      console.log(
        `number of users in ${socketInformation.roomName} : ${
          this.namespace.adapter.rooms.get(socketInformation.roomName)?.size
        }`,
      );
    });
  }

  private emitHistory(roomName: string, history: MessageInterface[]) {
    this.namespace.to(roomName).emit(ROOM_EVENT_NAME, history);
  }

  protected listenLeaveRoom(socket: Socket) {
    socket.on(
      LEAVE_ROOM_EVENT_NAME,
      (socketInformation: SocketRoomInformation) => {
        console.log(
          `${socketInformation.userId} has left room ${socketInformation.roomName}`,
        );
        socket.leave(socketInformation.roomName);

        console.log(
          `number of users in ${socketInformation.roomName} : ${
            this.namespace.adapter.rooms.get(socketInformation.roomName)?.size
          }`,
        );
      },
    );
  }

  protected listenDisconnect(socket: Socket) {
    super.listenDisconnect(socket);
  }
}
