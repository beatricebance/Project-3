import { Injectable } from "@angular/core";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { Point } from "src/app/shared";
import { SelectionCommandConstants } from "./command-type-constant";
import { ResizeSelectionService } from "./resize-command/resize-selection.service";
import { TranslateSelectionService } from "./translate-command/translate-selection.service";

@Injectable({
  providedIn: "root",
})
export class SelectionTransformService {
  private commandType: number;

  constructor(
    private resizeSelectionService: ResizeSelectionService,
    private translateSelectionService: TranslateSelectionService
  ) {}

  setCtrlPointList(ctrlPointList: SVGRectElement[]): void {
    this.resizeSelectionService.setCtrlPointList(ctrlPointList);
  }

  createCommand(
    type: number,
    recSelection: SVGPolygonElement,
    objectList: SVGElement[],
    offset: Point = { x: 0, y: 0 },
    ctrlPoint: SVGRectElement | null = null
  ): void {
    this.commandType = type;
    switch (type) {
      case SelectionCommandConstants.RESIZE: {
        this.resizeSelectionService.createResizeCommand(
          recSelection,
          objectList,
          offset,
          ctrlPoint
        );
        break;
      }

      case SelectionCommandConstants.TRANSLATE: {
        this.translateSelectionService.createTranslateCommand(objectList);
        break;
      }
    }
  }

  endCommand(): void {
    switch (this.commandType) {
      case SelectionCommandConstants.RESIZE: {
        this.resizeSelectionService.endCommand();
        break;
      }
      case SelectionCommandConstants.TRANSLATE: {
        this.translateSelectionService.endCommand();
        break;
      }
    }
    this.commandType = SelectionCommandConstants.NONE;
  }

  setCommandType(type: number): void {
    this.commandType = type;
  }

  setAlt(value: boolean): void {
    this.resizeSelectionService.isAlt = value;
  }

  setShift(value: boolean): void {
    this.resizeSelectionService.isShift = value;
  }

  hasCommand(): boolean {
    return this.resizeSelectionService.hasCommand();
  }

  getCommandType(): number {
    return this.commandType;
  }

  getCommand(): ICommand {
    switch (this.commandType) {
      case SelectionCommandConstants.RESIZE: {
        return this.resizeSelectionService.getCommand();
      }
      case SelectionCommandConstants.TRANSLATE:
        return this.translateSelectionService.getCommand();
      default:
        throw new Error("No such command for selection! :(");
    }
  }

  resize(deltaX: number, deltaY: number, offset: Point): void {
    this.resizeSelectionService.resize(deltaX, deltaY, offset);
  }

  resizeWithLastOffset(): void {
    this.resizeSelectionService.resizeWithLastOffset();
  }

  translate(deltaX: number, deltaY: number): void {
    this.translateSelectionService.translate(deltaX, deltaY);
  }
}
