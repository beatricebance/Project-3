import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { faPencilAlt, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { DrawingService } from "../../drawing/drawing.service";
import { OffsetManagerService } from "../../offset-manager/offset-manager.service";
import { RendererProviderService } from "../../renderer-provider/renderer-provider.service";
import { ToolsColorService } from "src/app/modules/tools-color/services/tools-color.service";
import { Tools } from "../../../interfaces/tools.interface";
import { ToolIdConstants } from "../tool-id-constants";
import { INITIAL_WIDTH, LEFT_CLICK, RIGHT_CLICK } from "../tools-constants";
import { PencilCommand } from "./pencil-command";
import { InProgressPencil, Pencil } from "./pencil.model";
import { DrawingSocketService } from "../../synchronisation/sockets/drawing-socket/drawing-socket.service";
import { UuidGeneratorService } from "src/app/shared/id-generator/uuid-generator.service";

/// Service de l'outil pencil, permet de créer des polyline en svg
/// Il est possible d'ajuster le stroke width dans le form
@Injectable({
  providedIn: "root",
})
export class PencilToolService implements Tools {
  readonly toolName = "Outil Crayon";
  readonly faIcon: IconDefinition = faPencilAlt;
  readonly id = ToolIdConstants.PENCIL_ID;
  private strokeWidth: FormControl;
  private pencil: Pencil | null;
  private pencilCommand: PencilCommand | null;

  private inProgressPencil: InProgressPencil | null;

  parameters: FormGroup;

  constructor(
    private offsetManager: OffsetManagerService,
    private colorTool: ToolsColorService,
    private drawingService: DrawingService,
    private rendererService: RendererProviderService,
    private drawingSocketService: DrawingSocketService,
    private uuidGeneratorService: UuidGeneratorService
  ) {
    this.strokeWidth = new FormControl(INITIAL_WIDTH);
    this.parameters = new FormGroup({
      strokeWidth: this.strokeWidth,
    });
  }

  /// Création d'un polyline selon la position de l'evenement de souris, choisi les bonnes couleurs selon le clique de souris
  onPressed(event: MouseEvent): void {
    if (event.button === RIGHT_CLICK || event.button === LEFT_CLICK) {
      if (this.strokeWidth.valid) {
        const offset: { x: number; y: number } =
          this.offsetManager.offsetFromMouseEvent(event);

        const shapeId = this.uuidGeneratorService.generateId();
        this.pencil = {
          id: shapeId,
          pointsList: [offset],
          strokeWidth: this.strokeWidth.value,
          fill: "none",
          stroke: "none",
          fillOpacity: "none",
          strokeOpacity: "none",
        };

        this.inProgressPencil = {
          id: shapeId,
          point: offset,
        };

        if (event.button === LEFT_CLICK) {
          this.setPencilStrokeAndOpacity(
            this.colorTool.primaryColorString,
            this.colorTool.primaryAlpha.toString()
          );
        } else {
          this.setPencilStrokeAndOpacity(
            this.colorTool.secondaryColorString,
            this.colorTool.secondaryAlpha.toString()
          );
        }
        this.pencilCommand = new PencilCommand(
          this.rendererService.renderer,
          this.pencil,
          this.drawingService
        );
        this.pencilCommand.execute();
        this.drawingSocketService.sendInProgressDrawingCommand(
          this.pencil,
          "Pencil"
        );
      }
    }
  }

  private setPencilStrokeAndOpacity(
    strokeColorString: string,
    strokeOpacityString: string
  ): void {
    if (!this.pencil) return;
    this.pencil.stroke = strokeColorString;
    this.pencil.strokeOpacity = strokeOpacityString;
  }

  /// Réinitialisation de l'outil après avoir laisser le clique de la souris
  onRelease(event: MouseEvent): void | ICommand {
    this.drawingSocketService.sendConfirmDrawingCommand(this.pencil, "Pencil");
    this.pencil = null;
    this.inProgressPencil = null;
    if (this.pencilCommand) {
      const returnPencilCommand = this.pencilCommand;
      this.pencilCommand = null;
      return returnPencilCommand;
      // TODO: Probably add a release event for socket that will put the pencil drawing into the real object list
    }
    return;
  }

  /// Ajout d'un point selon le déplacement de la souris
  onMove(event: MouseEvent): void {
    if (this.pencilCommand) {
      const mousePosition = this.offsetManager.offsetFromMouseEvent(event);
      this.pencilCommand.addPoint(mousePosition);
      this.inProgressPencil!.point = mousePosition;
      this.drawingSocketService.sendInProgressDrawingCommand(
        this.inProgressPencil,
        "Pencil"
      );
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    return;
  }
  onKeyDown(event: KeyboardEvent): void {
    return;
  }
  pickupTool(): void {
    return;
  }
  dropTool(): void {
    return;
  }
}
