import {
  COLLABORATIVE_DRAWING_NAMESPACE,
  CONFIRM_DRAW_EVENT,
  IN_PROGRESS_DRAW_EVENT,
  CONFIRM_ERASE_EVENT,
  START_SELECTION_EVENT,
  CONFIRM_SELECTION_EVENT,
  TRANSFORM_SELECTION_EVENT,
  DELETE_SELECTION_EVENT,
  UPDATE_DRAWING_EVENT,
  FETCH_DRIVING_EVENT,
  UPDATE_DRAWING_NOTIFICATION,
  ROOM_EMPTY_RESPONSE,
  ROOM_NOT_FOUND_RESPONSE,
  ONE_USER_RESPONSE,
  NEW_USER_RESPONSE,
  PRIMARY_COLOR_EVENT,
  SECONDARY_COLOR_EVENT,
  LINE_WIDTH_EVENT,
  ROOM_EVENT_NAME,
  LEAVE_ROOM_EVENT_NAME,
} from '../../constants/socket-constants';
import { SocketServiceInterface } from '../../../domain/interfaces/socket.interface';
import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { DrawingCommand } from '../../../domain/interfaces/drawing-command.interface';
import { Color } from '../../../domain/interfaces/color.interface';
import { LineWidth } from '../../../domain/interfaces/line-width.interface';
import { UserRepository } from '../../../infrastructure/data_access/repositories/user_repository';
import { TYPES } from '../../../domain/constants/types';
import { SocketRoomInformation } from '../../../domain/interfaces/socket-information';
import { CollaborationTrackerService } from '../collaboration-tracker.service';
import { StatusService } from '../status.service';
import { STATUS } from '../../../domain/constants/status';

@injectable()
export class DrawingSocketService extends SocketServiceInterface {
  @inject(TYPES.UserRepository) public userRepository: UserRepository;
  @inject(TYPES.CollaborationTrackerService)
  public collaborationTrackerService: CollaborationTrackerService;
  @inject(TYPES.StatusService) public statusService: StatusService;

  init(io: Server) {
    super.init(io, COLLABORATIVE_DRAWING_NAMESPACE);
  }

  protected setSocketListens(socket: Socket): void {
    this.listenInProgressDrawingCommand(socket);
    this.listenConfirmDrawingCommand(socket);
    this.listenConfirmEraseCommand(socket);

    // Listens related to the selection functionnality.
    this.listenStartSelectionCommand(socket);
    this.listenConfirmSelectionCommand(socket);
    this.listenTransformSelectionCommand(socket);
    this.listenDeleteSelectionCommand(socket);
    this.listenGetUpdatedDrawing(socket);
    this.listenDrawingRequestBroadcastRequest(socket);
    this.listenObjectPrimaryColorChange(socket);
    this.listenObjectSecondaryColorChange(socket);
    this.listenLineWidthChange(socket);
  }

  protected listenRoom(socket: Socket): void {
    socket.on(ROOM_EVENT_NAME, (socketInformation: SocketRoomInformation) => {
      console.log(
        `${socketInformation.userId} has joined room ${socketInformation.roomName}`,
      );

      this.userRepository.updateCollaborationHistory(
        socketInformation.userId,
        socketInformation.roomName,
      );

      this.collaborationTrackerService.onSessionJoin(
        socketInformation.roomName,
        socketInformation.userId,
      );

      this.statusService.updateStatus(
        socketInformation.userId,
        STATUS.Collaborating,
      );

      socket.join(socketInformation.roomName);
    });
  }

  protected listenLeaveRoom(socket: Socket) {
    socket.on(
      LEAVE_ROOM_EVENT_NAME,
      (socketInformation: SocketRoomInformation) => {
        this.statusService.updateStatus(
          socketInformation.userId,
          STATUS.Online,
        );

        this.collaborationTrackerService.onSessionLeave(
          socketInformation.roomName,
          socketInformation.userId,
        );

        console.log(
          `${socketInformation.userId} has left room ${socketInformation.roomName}`,
        );

        socket.leave(socketInformation.roomName);
      },
    );
  }

  private listenLineWidthChange(socket: Socket): void {
    socket.on(LINE_WIDTH_EVENT, (lineWidthData) => {
      this.sendLineWidthData(socket, lineWidthData);
    });
  }

  private sendLineWidthData(socket: Socket, lineWidthData: LineWidth) {
    socket.to(lineWidthData.roomName).emit(LINE_WIDTH_EVENT, lineWidthData);
  }

  private listenObjectPrimaryColorChange(socket: Socket): void {
    socket.on(PRIMARY_COLOR_EVENT, (colorData) => {
      this.sendObjectPrimaryColorChange(socket, colorData);
    });
  }

  private sendObjectPrimaryColorChange(socket: Socket, colorData: Color) {
    socket.to(colorData.roomName).emit(PRIMARY_COLOR_EVENT, colorData);
  }

  private listenObjectSecondaryColorChange(socket: Socket): void {
    socket.on(SECONDARY_COLOR_EVENT, (colorData) => {
      this.sendObjectSecondaryColorChange(socket, colorData);
    });
  }

  private sendObjectSecondaryColorChange(socket: Socket, colorData: Color) {
    socket.to(colorData.roomName).emit(SECONDARY_COLOR_EVENT, colorData);
  }

  private listenInProgressDrawingCommand(socket: Socket): void {
    socket.on(IN_PROGRESS_DRAW_EVENT, (drawingCommand: DrawingCommand) => {
      console.log(drawingCommand);
      this.emitInProgressDrawingCommand(drawingCommand, socket);
    });
  }

  // Will be used to store all the drawn shapes since the join of the drawing.
  // Allows users to load what was there.
  private listenConfirmDrawingCommand(socket: Socket): void {
    socket.on(CONFIRM_DRAW_EVENT, (drawingCommand: DrawingCommand) => {
      console.log(drawingCommand);
      this.emitConfirmDrawingCommand(drawingCommand, socket);
    });
  }

  private listenConfirmEraseCommand(socket: Socket): void {
    socket.on(CONFIRM_ERASE_EVENT, (eraseCommand: any) => {
      this.emitConfirmEraseCommand(eraseCommand, socket);
    });
  }

  private listenStartSelectionCommand(socket: Socket): void {
    socket.on(START_SELECTION_EVENT, (selectionCommand: any) => {
      this.emitStartSelectionCommand(selectionCommand, socket);
    });
  }

  private listenConfirmSelectionCommand(socket: Socket): void {
    socket.on(CONFIRM_SELECTION_EVENT, (selectionCommand: any) => {
      this.emitConfirmSelectionCommand(selectionCommand, socket);
    });
  }

  private listenTransformSelectionCommand(socket: Socket): void {
    socket.on(TRANSFORM_SELECTION_EVENT, (selectionCommand: any) => {
      console.log(selectionCommand);
      this.emitTransformSelectionCommand(selectionCommand, socket);
    });
  }

  private listenDeleteSelectionCommand(socket: Socket): void {
    socket.on(DELETE_SELECTION_EVENT, (deleteSelectionCommand: any) => {
      this.emitDeleteSelectionCommand(deleteSelectionCommand, socket);
    });
  }

  private listenGetUpdatedDrawing(socket: Socket): void {
    socket.on(UPDATE_DRAWING_EVENT, (roomName: string, callback) => {
      console.log('Request update drawing room: ', roomName);
      const clientIdsInRoomSet = this.namespace.adapter.rooms.get(roomName);

      if (!clientIdsInRoomSet) {
        callback({
          status: ROOM_NOT_FOUND_RESPONSE,
        });
        return;
      }

      if (clientIdsInRoomSet.size < 1) {
        console.log(`Room ${roomName} is empty`);
        callback({
          status: ROOM_EMPTY_RESPONSE,
        });
        return;
      }

      let alreadyConnectedUserId;
      for (let clientInRoomSet of clientIdsInRoomSet) {
        if (clientInRoomSet != socket.id) {
          alreadyConnectedUserId = clientInRoomSet;
          break;
        }
      }

      if (!alreadyConnectedUserId) {
        callback({
          status: ONE_USER_RESPONSE,
        });
        return;
      }

      this.sendUpdateDrawingRequest(socket, alreadyConnectedUserId, socket.id);

      callback({
        status: NEW_USER_RESPONSE,
      });
    });
  }

  private sendUpdateDrawingRequest(
    socket: Socket,
    alreadyConnectedUserId: string,
    newClientId: string,
  ): void {
    let request = {
      newUserId: newClientId,
      alreadyConnectedUserId: alreadyConnectedUserId,
    };
    socket.broadcast
      .to(alreadyConnectedUserId)
      .emit(UPDATE_DRAWING_EVENT, request);
  }

  private listenDrawingRequestBroadcastRequest(socket: Socket): void {
    socket.on(UPDATE_DRAWING_NOTIFICATION, (newClientId) => {
      this.sendFetchDrawingNotification(socket, newClientId);
    });
  }

  private sendFetchDrawingNotification(
    socket: Socket,
    newClientId: string,
  ): void {
    socket.broadcast.to(newClientId).emit(FETCH_DRIVING_EVENT);
  }

  private emitInProgressDrawingCommand(
    drawingCommand: DrawingCommand,
    socket: Socket,
  ): void {
    socket
      .to(drawingCommand.roomName)
      .emit(IN_PROGRESS_DRAW_EVENT, drawingCommand);
  }

  private emitConfirmEraseCommand(drawingCommand: any, socket: Socket): void {
    socket
      .to(drawingCommand.roomName)
      .emit(CONFIRM_ERASE_EVENT, drawingCommand);
  }

  private emitConfirmDrawingCommand(
    drawingCommand: DrawingCommand,
    socket: Socket,
  ): void {
    socket.to(drawingCommand.roomName).emit(CONFIRM_DRAW_EVENT, drawingCommand);
  }

  // Emits related to the selection functionnality.

  private emitStartSelectionCommand(drawingCommand: any, socket: Socket): void {
    socket
      .to(drawingCommand.roomName)
      .emit(START_SELECTION_EVENT, drawingCommand);
  }

  private emitConfirmSelectionCommand(
    drawingCommand: any,
    socket: Socket,
  ): void {
    socket
      .to(drawingCommand.roomName)
      .emit(CONFIRM_SELECTION_EVENT, drawingCommand);
  }

  private emitTransformSelectionCommand(
    drawingCommand: any,
    socket: Socket,
  ): void {
    console.log(drawingCommand);
    socket
      .to(drawingCommand.roomName)
      .emit(TRANSFORM_SELECTION_EVENT, drawingCommand);
  }

  private emitDeleteSelectionCommand(
    drawingCommand: any,
    socket: Socket,
  ): void {
    socket
      .to(drawingCommand.roomName)
      .emit(DELETE_SELECTION_EVENT, drawingCommand);
  }
}
