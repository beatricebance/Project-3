import { RendererProviderService } from "src/app/modules/workspace";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";

export class LineWidthCommand implements ICommand{

  constructor(
    private svgElement: SVGElement,
    private strokeWidth: number,
    private rendererService: RendererProviderService
  ) { }

  update(drawingCommand: any): void {
    throw new Error("Method not implemented.");
  }

  /// Rajout des elements suprimé
  undo(): void {
    throw new Error("Method undefined.");
  }

  execute(): void {
    const strokeWidthString = `${this.strokeWidth}px`;
    if (this.svgElement.tagName == "circle") {
      this.rendererService.renderer.setAttribute(
        this.svgElement,
        "r",
        strokeWidthString
      );
    } else {
      this.rendererService.renderer.setStyle(
        this.svgElement,
        "stroke-width",
        strokeWidthString
      );
    }
  }
}
