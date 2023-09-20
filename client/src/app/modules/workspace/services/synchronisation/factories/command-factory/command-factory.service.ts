import { Injectable } from "@angular/core";
import { DrawingService } from "../../../drawing/drawing.service";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import {
  DeleteCommand,
  EllipseCommand,
  EraserCommand,
  PencilCommand,
  RectangleCommand,
  RendererProviderService,
  ResizeCommand,
  TranslateCommand,
} from "src/app/modules/workspace";
import { Pencil } from "../../../tools/pencil-tool/pencil.model";
import { Rectangle } from "../../../tools/tool-rectangle/rectangle.model";
import { Ellipse } from "../../../tools/tool-ellipse/ellipse.model";
import { SelectionStartCommand } from "../../../tools/selection-tool/start-command/selection-start-command.service";
import { LineWidthCommand } from "../../../tools/selection-tool/line-width-command/line-width-command.service";
import { PrimaryColorCommand } from "../../../tools/selection-tool/primary-color-command/primary-color-command.service";
import { SecondaryColorCommand } from "../../../tools/selection-tool/secondary-color-command/secondary-color-command.service";
@Injectable({
  providedIn: "root",
})
export class CommandFactoryService {
  constructor(
    private drawingService: DrawingService,
    private rendererService: RendererProviderService
  ) {}

  createCommand(commandType: string, commandParameters: any): ICommand {
    switch (commandType) {
      case "Pencil":
        return new PencilCommand(
          this.rendererService.renderer,
          commandParameters as Pencil,
          this.drawingService
        );
      case "Rectangle":
        return new RectangleCommand(
          this.rendererService.renderer,
          commandParameters as Rectangle,
          this.drawingService
        );
      case "Ellipse":
        return new EllipseCommand(
          this.rendererService.renderer,
          commandParameters as Ellipse,
          this.drawingService
        );
      case "Eraser":
        let itemsToDelete = new Map<string, SVGElement>();
        for (const id of <string[]>commandParameters) {
          const svgElement = this.drawingService.getObject(id);
          if (svgElement) {
            itemsToDelete.set(id, svgElement);
          }
        }
        return new EraserCommand(itemsToDelete, this.drawingService);
      case "SelectionStart":
        const selectedShapeId = commandParameters.id;
        const selectedShape = this.drawingService.getObject(selectedShapeId);
        if (selectedShape == undefined) {
          throw new Error("Could not find current shape");
        }
        return new SelectionStartCommand(selectedShape);
      case "SelectionResize":
        const resizeShapeId = commandParameters.id;
        const resizeShape = this.drawingService.getObject(resizeShapeId);
        if (resizeShape == undefined) {
          throw new Error("Could not find current shape");
        }
        let resizeSelectionCommand = new ResizeCommand(
          this.rendererService.renderer,
          [resizeShape]
        );
        resizeSelectionCommand.setScales(
          commandParameters.xScaled,
          commandParameters.yScaled,
          commandParameters.xTranslate,
          commandParameters.yTranslate
        );
        return resizeSelectionCommand;
      case "Translation":
        const translationShapeId = commandParameters.id;
        const translationShape =
          this.drawingService.getObject(translationShapeId);
        if (translationShape == undefined)
          throw new Error("Shape could not befound in the object list.");
        let translateCommand = new TranslateCommand(
          this.rendererService.renderer,
          translationShape
        );
        translateCommand.setTransformation(
          commandParameters.deltaX,
          commandParameters.deltaY
        );
        return translateCommand;
      case "Delete":
        const id = commandParameters.id;
        const deletedShape = this.drawingService.getObject(id);
        if (deletedShape == undefined)
          throw new Error("Couldn't find the shape you wanted to delete.");
        return new DeleteCommand(this.drawingService, deletedShape);
      case "LineWidth":
        const lineWidthShapeId = commandParameters.id;
        const lineWidthShape = this.drawingService.getObject(lineWidthShapeId);
        if(lineWidthShape == undefined)
          throw new Error("Couldn't find the shape you wanted to delete.");
        return new LineWidthCommand(lineWidthShape, commandParameters.lineWidth, this.rendererService);
      case "PrimaryColor":
        const objectToRecolorId = commandParameters.id;
        const objectToRecolor = this.drawingService.getObject(objectToRecolorId);
        if(objectToRecolor == undefined)
          throw new Error("Couldn't find the shape you wanted to delete.");
        return new PrimaryColorCommand(objectToRecolor, commandParameters.color, commandParameters.opacity);
      case "SecondaryColor":
        const objectToRecolorSecondary = this.drawingService.objects.get(commandParameters.id);
        if(objectToRecolorSecondary == undefined)
          throw new Error("Couldn't find the shape you wanted to delete.");
        return new SecondaryColorCommand(objectToRecolorSecondary, commandParameters.color, commandParameters.opacity);
      default:
        throw new Error("Unable to create command");
    }
  }
}
