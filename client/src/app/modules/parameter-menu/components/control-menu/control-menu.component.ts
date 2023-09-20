import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CommandInvokerService } from "src/app/modules/workspace";
import { DrawingService } from "src/app/modules/workspace";
import { NewDrawingComponent } from "src/app/modules/new-drawing";

/// Component pour afficher les options fichiers
@Component({
  selector: "app-control-menu",
  templateUrl: "./control-menu.component.html",
  styleUrls: ["./control-menu.component.scss"],
})
export class ControlMenuComponent {
  constructor(
    private dialog: MatDialog,
    private drawingService: DrawingService,
    private commandInvoker: CommandInvokerService,
    
  ) {}

  get isSaved(): boolean {
    return this.drawingService.isSaved;
  }
  get isCreated(): boolean {
    return this.drawingService.isCreated;
  }

  /// Ouvre une nouveau dialog de creation de dessin
  openNewDrawing(): void {
    this.dialog.open(NewDrawingComponent, {});
  }

  get canUndo(): boolean {
    return this.commandInvoker.canUndo;
  }

  get canRedo(): boolean {
    return this.commandInvoker.canRedo;
  }

  /// Undo
  undo(): void {
    this.commandInvoker.undo();
  }

  /// Redo
  redo(): void {
    this.commandInvoker.redo();
  }
}
