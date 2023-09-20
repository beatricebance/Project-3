import { Injectable } from "@angular/core";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { RendererProviderService } from "src/app/modules/workspace";
import { TranslateCommand } from "./translate-command";

@Injectable({
  providedIn: "root",
})
export class TranslateSelectionService {
  private objectList: SVGElement[];

  private translateCommand: TranslateCommand | null;

  private delta: { dx: number; dy: number } = { dx: 0, dy: 0 };

  constructor(private rendererService: RendererProviderService) {}

  createTranslateCommand(objectList: SVGElement[]): ICommand {
    this.delta = { dx: 0, dy: 0 };
    this.objectList = objectList;
    this.translateCommand = new TranslateCommand(
      this.rendererService.renderer,
      this.objectList[0]
    );
    return this.translateCommand;
  }

  endCommand(): void {
    this.delta = { dx: 0, dy: 0 };
    this.translateCommand = null;
  }

  hasCommand(): boolean {
    return this.translateCommand ? true : false;
  }

  getCommand(): ICommand {
    return this.translateCommand as TranslateCommand;
  }

  translate(deltaX: number, deltaY: number): void {
    if (this.translateCommand) {
      this.delta.dx = deltaX;
      this.delta.dy = deltaY;
      this.translateCommand.translate(this.delta.dx, this.delta.dy);
    }
  }
}
