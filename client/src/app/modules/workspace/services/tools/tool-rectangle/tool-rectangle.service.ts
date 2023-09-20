import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { faSquareFull } from "@fortawesome/free-solid-svg-icons";
import { ToolsColorService } from "src/app/modules/tools-color/services/tools-color.service";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { UuidGeneratorService } from "src/app/shared/id-generator/uuid-generator.service";
import { Tools } from "../../../interfaces/tools.interface";
import { DrawingService } from "../../drawing/drawing.service";
import { OffsetManagerService } from "../../offset-manager/offset-manager.service";
import { RendererProviderService } from "../../renderer-provider/renderer-provider.service";
import { DrawingSocketService } from "../../synchronisation/sockets/drawing-socket/drawing-socket.service";
import { ToolIdConstants } from "../tool-id-constants";
import { LEFT_CLICK, RIGHT_CLICK } from "../tools-constants";
import { RectangleCommand } from "./rectangle-command";
import { InProgressRectangle, Rectangle } from "./rectangle.model";

/// Outil pour créer des rectangle, click suivis de bouge suivis de relache crée le rectangle
/// et avec shift créer un carrée
@Injectable({
  providedIn: "root",
})
export class ToolRectangleService implements Tools {
  readonly faIcon: IconDefinition = faSquareFull;
  readonly toolName = "Outil Rectangle";
  readonly id = ToolIdConstants.RECTANGLE_ID;

  private rectangle: Rectangle | null = null;
  private rectangleCommand: RectangleCommand | null = null;
  private inProgressRectangle: InProgressRectangle | null = null;

  parameters: FormGroup;
  private strokeWidth: FormControl;
  private rectStyle: FormControl;

  private isSquare = false;
  private oldX = 0;
  private oldY = 0;

  private x: number;
  private y: number;

  constructor(
    private offsetManager: OffsetManagerService,
    private colorTool: ToolsColorService,
    private drawingService: DrawingService,
    private rendererService: RendererProviderService,
    private drawingSocketService: DrawingSocketService,
    private uuidGeneratorService: UuidGeneratorService
  ) {
    this.strokeWidth = new FormControl(1, Validators.min(1));
    this.rectStyle = new FormControl("fill");
    this.parameters = new FormGroup({
      strokeWidth: this.strokeWidth,
      rectStyle: this.rectStyle,
    });
  }

  /// Quand le bouton de la sourie est enfoncé, on crée un rectangle et on le retourne
  /// en sortie et est inceré dans l'objet courrant de l'outil.
  onPressed(event: MouseEvent): void {
    if (event.button === RIGHT_CLICK || event.button === LEFT_CLICK) {
      const offset: { x: number; y: number } =
        this.offsetManager.offsetFromMouseEvent(event);
      this.x = offset.x;
      this.y = offset.y;
      this.oldX = offset.x;
      this.oldY = offset.y;

      const rectangleId = this.uuidGeneratorService.generateId();

      this.rectangle = {
        id: rectangleId,
        x: this.x,
        y: this.y,
        width: 0,
        height: 0,
        strokeWidth: this.strokeWidth.value as number,
        fill: "none",
        stroke: "none",
        fillOpacity: "none",
        strokeOpacity: "none",
      };

      this.inProgressRectangle = {
        id: rectangleId,
        x: this.x,
        y: this.y,
        width: 0,
        height: 0,
      };

      if (event.button === LEFT_CLICK) {
        this.setStyle(
          this.colorTool.primaryColorString,
          this.colorTool.primaryAlpha.toString(),
          this.colorTool.secondaryColorString,
          this.colorTool.secondaryAlpha.toString()
        );
      } else {
        this.setStyle(
          this.colorTool.secondaryColorString,
          this.colorTool.secondaryAlpha.toString(),
          this.colorTool.primaryColorString,
          this.colorTool.primaryAlpha.toString()
        );
      }
      this.rectangleCommand = new RectangleCommand(
        this.rendererService.renderer,
        this.rectangle,
        this.drawingService
      );
      this.rectangleCommand.execute();

      this.drawingSocketService.sendInProgressDrawingCommand(
        this.rectangle,
        "Rectangle"
      );
    }
  }

  /// Quand le bouton de la sourie est relaché, l'objet courrant de l'outil est mis a null.
  onRelease(event: MouseEvent): ICommand | void {
    this.drawingSocketService.sendConfirmDrawingCommand(this.rectangle, "Rectangle");
    this.isSquare = false;
    this.rectangle = null;
    if (this.rectangleCommand) {
      const returnRectangleCommand = this.rectangleCommand;
      this.rectangleCommand = null;
      return returnRectangleCommand;
    }
    return;
  }

  /// Quand le bouton de la sourie est apuyé et on bouge celle-ci, l'objet courrant subit des modifications.
  onMove(event: MouseEvent): void {
    const offset: { x: number; y: number } =
      this.offsetManager.offsetFromMouseEvent(event);
    const rectangleAttributes = this.setSize(offset.x, offset.y);

    this.inProgressRectangle!.x = rectangleAttributes[0];
    this.inProgressRectangle!.y = rectangleAttributes[1];
    this.inProgressRectangle!.width = rectangleAttributes[2];
    this.inProgressRectangle!.height = rectangleAttributes[3];

    this.drawingSocketService.sendInProgressDrawingCommand(
      this.inProgressRectangle,
      "Rectangle"
    );
  }

  /// Verification de la touche shift
  onKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey) {
      this.isSquare = true;
      this.setSize(this.oldX, this.oldY);
    }
  }

  /// Verification de la touche shift
  onKeyUp(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      this.isSquare = false;
      this.setSize(this.oldX, this.oldY);
    }
  }

  pickupTool(): void {
    return;
  }
  dropTool(): void {
    return;
  }

  /// Transforme le size de l'objet courrant avec un x et un y en entrée
  private setSize(mouseX: number, mouseY: number): number[] {
    if (!this.rectangleCommand || !this.rectangle) {
      return [];
    }
    let strokeFactor = 0;
    if (this.rectangle.stroke !== "none") {
      strokeFactor = this.strokeWidth.value;
    }

    this.oldX = mouseX;
    this.oldY = mouseY;

    let width = Math.abs(mouseX - this.x);
    let height = Math.abs(mouseY - this.y);

    let xValue = this.x;
    let yValue = this.y;

    if (mouseY < this.y) {
      yValue = mouseY;
    }
    if (mouseX < this.x) {
      xValue = mouseX;
    }

    if (this.isSquare) {
      const minSide = Math.min(width, height);
      if (mouseX < this.x) {
        xValue += width - minSide;
      }
      if (mouseY < this.y) {
        yValue += height - minSide;
      }
      width = minSide;
      height = minSide;
    }

    let x =
      width - strokeFactor <= 0
        ? xValue + strokeFactor / 2 + (width - strokeFactor)
        : xValue + strokeFactor / 2;

    let y =
      height - strokeFactor <= 0
        ? yValue + strokeFactor / 2 + (height - strokeFactor)
        : yValue + strokeFactor / 2;

    let rectangleHeight =
      height - strokeFactor <= 0 ? 1 : height - strokeFactor;

    let rectangleWidth = width - strokeFactor <= 0 ? 1 : width - strokeFactor;

    this.rectangleCommand.setX(x);

    this.rectangleCommand.setY(y);

    this.rectangleCommand.setWidth(rectangleWidth);

    this.rectangleCommand.setHeight(rectangleHeight);

    return [x, y, rectangleWidth, rectangleHeight];
  }

  /// Pour definir le style du rectangle (complet, contour, centre)
  private setStyle(
    primaryColor: string,
    primaryAlpha: string,
    secondaryColor: string,
    secondaryAlpha: string
  ): void {
    if (!this.rectangle) {
      return;
    }
    switch (this.rectStyle.value) {
      case "center":
        this.rectangle.fill = primaryColor;
        this.rectangle.fillOpacity = primaryAlpha;
        this.rectangle.stroke = "none";
        this.rectangle.strokeOpacity = "none";
        break;

      case "border":
        this.rectangle.fill = "none";
        this.rectangle.fillOpacity = "none";
        this.rectangle.stroke = secondaryColor;
        this.rectangle.strokeOpacity = secondaryAlpha;
        break;

      case "fill":
        this.rectangle.fill = primaryColor;
        this.rectangle.fillOpacity = primaryAlpha;
        this.rectangle.stroke = secondaryColor;
        this.rectangle.strokeOpacity = secondaryAlpha;
        break;
    }
  }

  /**
   *
   * @param mouseX the x coordinate of the mouse position
   * @param mouseY the y coordinate of the mouse position
   * @returns an array of numbers
   *  [0] = width
   *  [1] = height
   *  [2] = the new value of x
   *  [3] = the new value of y
   *  [4] = the stroke factor
   */
  // private computeNewCoordinates(mouseX: number, mouseY: number): number[] {
  //   if (!this.rectangleCommand || !this.rectangle) {
  //     return [];
  //   }
  //   let strokeFactor = 0;
  //   if (this.rectangle.stroke !== "none") {
  //     strokeFactor = this.strokeWidth.value;
  //   }

  //   this.oldX = mouseX;
  //   this.oldY = mouseY;

  //   let width = Math.abs(mouseX - this.x);
  //   let height = Math.abs(mouseY - this.y);

  //   let xValue = this.x;
  //   let yValue = this.y;

  //   if (mouseY < this.y) {
  //     yValue = mouseY;
  //   }
  //   if (mouseX < this.x) {
  //     xValue = mouseX;
  //   }

  //   if (this.isSquare) {
  //     const minSide = Math.min(width, height);
  //     if (mouseX < this.x) {
  //       xValue += width - minSide;
  //     }
  //     if (mouseY < this.y) {
  //       yValue += height - minSide;
  //     }
  //     width = minSide;
  //     height = minSide;
  //   }

  //   return [width, height, xValue, yValue, strokeFactor];
  // }

  //   private computeNewX(width: number, xValue: number, strokeFactor: number) {
  //     return width - strokeFactor <= 0
  //       ? xValue + strokeFactor / 2 + (width - strokeFactor)
  //       : xValue + strokeFactor / 2;
  //   }

  //   private computeNewY(height: number, yValue: number, strokeFactor: number) {
  //     return height - strokeFactor <= 0
  //       ? yValue + strokeFactor / 2 + (height - strokeFactor)
  //       : yValue + strokeFactor / 2;
  //   }

  //   private computeHeight(height: number, strokeFactor: number) {
  //     return       height - strokeFactor <= 0 ? 1 : height - strokeFactor

  // ;
  //   }
}
