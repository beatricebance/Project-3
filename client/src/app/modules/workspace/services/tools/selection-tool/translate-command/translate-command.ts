import { Renderer2 } from "@angular/core";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";

export class TranslateCommand implements ICommand {
  private previousTransformation: Map<string, string> = new Map<
    string,
    string
  >();

  private deltaX: number;
  private deltaY: number;

  constructor(private renderer: Renderer2, private selectedShape: SVGElement) {
    const transform: string | null =
      this.selectedShape.getAttribute("transform");
    if (transform) {
      this.previousTransformation.set(this.selectedShape.id, transform);
    } else {
      this.previousTransformation.set(this.selectedShape.id, "");
    }
  }

  update(drawingCommand: any): void {
    this.setTransformation(drawingCommand.deltaX, drawingCommand.deltaY);
  }

  translate(xTranslate: number, yTranslate: number): void {
    const translateString = ` translate(${xTranslate} ${yTranslate})`;
    this.renderer.setAttribute(
      this.selectedShape,
      "transform",
      (translateString +
        this.previousTransformation.get(this.selectedShape.id)) as string
    );
  }

  setTransformation(x: number, y: number): void {
    this.deltaX = x;
    this.deltaY = y;
  }

  undo(): void {
    throw new Error("method not implemented.");
  }

  execute(): void {
    this.translate(this.deltaX, this.deltaY);
  }
}
