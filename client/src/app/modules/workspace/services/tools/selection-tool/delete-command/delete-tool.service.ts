import { Injectable } from "@angular/core";
import { CommandInvokerService } from "../../../command-invoker/command-invoker.service";
import { DrawingService } from "../../../drawing/drawing.service";
import { DrawingSocketService } from "../../../synchronisation/sockets/drawing-socket/drawing-socket.service";
import { SelectionToolService } from "../selection-tool.service";
import { DeleteCommand } from "./delete-command";
import { Delete } from "./delete.model";

/// Service ayant comme fonction d'effectuer la supression de selection
@Injectable({
  providedIn: "root",
})
export class DeletingToolService {
  private deleteCommand: DeleteCommand;
  private deleteModel: Delete;

  constructor(
    private selectionTool: SelectionToolService,
    private commandInvoker: CommandInvokerService,
    private drawingService: DrawingService,
    private drawingSocketService: DrawingSocketService
  ) {}

  /// Creation et execution d'une commande de supression
  deleteSelection(): void {
    this.deleteCommand = new DeleteCommand(
      this.drawingService,
      this.selectionTool.getObjectList()[0]
    );

    this.deleteModel = {
      id: this.selectionTool.getObjectList()[0].id,
    };

    this.drawingSocketService.sendDeleteSelectionCommand(
      this.deleteModel,
      "Delete"
    );

    this.commandInvoker.executeCommand(this.deleteCommand);

    this.selectionTool.removeSelection();
  }
}
