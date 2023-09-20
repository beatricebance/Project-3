import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SocketRoomInformation } from "src/app/shared/socket/socket-room-information";
import { DrawingService } from "../../workspace";
import { DrawingSocketService } from "../../workspace/services/synchronisation/sockets/drawing-socket/drawing-socket.service";
@Component({
  selector: "app-drawing",
  templateUrl: "./drawing.component.html",
  styleUrls: ["./drawing.component.scss"],
})
export class DrawingComponent implements OnInit, AfterViewInit {
  socketInformation: SocketRoomInformation;
  drawingId: string;
  constructor(
    private route: ActivatedRoute,
    private drawingService: DrawingService,
    private drawingSocketService: DrawingSocketService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.drawingId = params["id"];
      this.drawingService.drawingId = this.drawingId;
      this.socketInformation = {
        roomName: this.drawingId,
        userId: localStorage.getItem("userId")!,
      };
      this.drawingSocketService.connect();
      this.drawingSocketService.joinRoom(this.socketInformation);
    });
  }

  ngAfterViewInit(): void {
    this.drawingSocketService.sendGetUpdateDrawingRequest();
  }

  ngOnDestroy(): void {
    this.drawingService.saveDrawing();
    this.drawingSocketService.leaveRoom(this.socketInformation);
  }
}
