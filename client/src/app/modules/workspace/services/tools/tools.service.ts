import { Injectable } from "@angular/core";
import { CommandInvokerService } from "src/app/modules/workspace";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { Tools } from "../../interfaces/tools.interface";
import { DrawingService } from "../drawing/drawing.service";
import { EraserToolService } from "./eraser-tool/eraser-tool.service";
import { LineToolService } from "./line-tool/line-tool.service";
import { PencilToolService } from "./pencil-tool/pencil-tool.service";
import { PolygonToolService } from "./polygon-tool/polygon-tool.service";
import { SelectionToolService } from "./selection-tool/selection-tool.service";
import { ToolEllipseService } from "./tool-ellipse/tool-ellipse.service";
import { ToolIdConstants } from "./tool-id-constants";
import { ToolRectangleService } from "./tool-rectangle/tool-rectangle.service";
import { ToolsApplierColorsService } from "./tools-applier-colors/tools-applier-colors.service";

/// Service permettant de gérer l'outil présent selon son ID
/// Appelle les bonnes fonctions d'évenement souris selon l'outil selectionner

@Injectable({
  providedIn: "root",
})
export class ToolsService {
  private isPressed = false;
  selectedToolId = 0;
  tools: Map<number, Tools> = new Map<number, Tools>();

  constructor(
    private drawingService: DrawingService,
    private pencilTool: PencilToolService,
    private colorApplicator: ToolsApplierColorsService,
    private rectangleTool: ToolRectangleService,
    private ellipseTool: ToolEllipseService,
    private polygonService: PolygonToolService,
    private lineTool: LineToolService,
    private selectionTool: SelectionToolService,
    private eraserTool: EraserToolService,

    private commandInvoker: CommandInvokerService
  ) {
    this.initTools();
    this.onKeyTriggered();
  }

  /// Initialiser la liste d'outil
  private initTools(): void {
    this.tools.set(this.pencilTool.id, this.pencilTool);
    this.tools.set(this.rectangleTool.id, this.rectangleTool);
    this.tools.set(this.ellipseTool.id, this.ellipseTool);
    this.tools.set(this.polygonService.id, this.polygonService);
    this.tools.set(this.lineTool.id, this.lineTool);
    this.tools.set(this.colorApplicator.id, this.colorApplicator);
    this.tools.set(this.selectionTool.id, this.selectionTool);
    this.tools.set(this.eraserTool.id, this.eraserTool);
  }

  /// Selectionner un outil avec son id
  selectTool(id: number): void {
    // appliquer les changements sur l'outil precedent
    const oldTool = this.selectedTool;
    if (oldTool) {
      oldTool.dropTool();
    }
    // selectionner le nouvel outil
    this.selectedToolId = id;

    const newTool = this.selectedTool;
    if (newTool) {
      newTool.pickupTool();
    }
  }

  /// Retourner l'outil presentement selectionné
  get selectedTool(): Tools | undefined {
    return this.tools.get(this.selectedToolId);
  }

  /// Appeller la fonction onPressed du bon outil et ajoute un objet au dessin si nécéssaire
  onPressed(event: MouseEvent): void {
    if (this.drawingService.isCreated) {
      const tool = this.selectedTool;
      if (!tool) {
        return;
      }

      tool.onPressed(event);
      this.isPressed = true;
    }
  }

  /// Appelle la fonction onRelease du bon outil et annule les entrée d'évenement souris
  onRelease(event: MouseEvent): void {
    if (this.drawingService.isCreated) {
      const tool = this.selectedTool;
      if (!tool) {
        return;
      }
      if (this.isPressed || tool.id === ToolIdConstants.LINE_ID) {
        const command: ICommand | void = tool.onRelease(event);
        if (command) {
          this.commandInvoker.addCommand(command);
        }
      }
      this.isPressed = false;
    }
  }

  /// Appelle la fonction onMove du bon outil si les entrée d'évenement souris son activé
  onMove(event: MouseEvent): void {
    if (this.drawingService.isCreated) {
      const tool = this.selectedTool;
      if (!tool) {
        return;
      }
      if (
        this.isPressed ||
        tool.id === ToolIdConstants.LINE_ID ||
        tool.id === ToolIdConstants.ERASER_ID
      ) {
        tool.onMove(event);
      }
    }
  }

  onKeyTriggered(): void {
    window.addEventListener("keydown", (event) => {
      if (this.drawingService.isCreated) {
        const tool = this.selectedTool;
        if (!tool) {
          return;
        }
        if (
          this.isPressed ||
          tool.id === ToolIdConstants.LINE_ID ||
          tool.id === ToolIdConstants.SELECTION_ID
        ) {
          tool.onKeyDown(event);
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      if (this.drawingService.isCreated) {
        event.preventDefault();
        const tool = this.selectedTool;
        if (!tool) {
          return;
        }
        if (
          this.isPressed ||
          tool.id === ToolIdConstants.LINE_ID ||
          tool.id === ToolIdConstants.SELECTION_ID
        ) {
          tool.onKeyUp(event);
        }
      }
    });
  }
}
