import { Injectable } from "@angular/core";
import { ICommand } from "../../../../interfaces/command.interface";

@Injectable({
  providedIn: "root",
})
export class SelectionStartCommand implements ICommand {
  constructor(private selectedShape: SVGElement) {}

  // Logging just to ignore the unused error
  update(drawingCommand: any): void {
    console.log(this.selectedShape);
    throw new Error("Method not implemented.");
  }

  undo(): void {
    throw new Error("Method not implemented.");
  }

  execute(): void {
    throw new Error("Method not implemented.");
  }
}
