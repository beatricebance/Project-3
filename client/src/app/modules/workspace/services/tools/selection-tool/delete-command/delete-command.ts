import { ICommand } from "../../../../interfaces/command.interface";
import { DrawingService } from "../../../drawing/drawing.service";

/// Commande permettant le retrait d'une liste d'element svg du dessin
export class DeleteCommand implements ICommand {
  private markerDef: SVGElement[] = [];

  constructor(
    private drawingService: DrawingService,
    private deletedShape: SVGElement
  ) {}

  update(drawingCommand: any): void {
    throw new Error("Method not implemented.");
  }

  /// Rajout des elements suprimé
  undo(): void {
    throw new Error("Method undefined.");
  }

  /// Retrait des elements de la liste du dessin
  execute(): void {
    this.drawingService.removeObject(this.deletedShape.id);

    const positionStart: number = this.deletedShape.outerHTML.indexOf(
      "url(#",
      0
    );
    if (positionStart !== -1) {
      const positionEnd: number = this.deletedShape.outerHTML.indexOf(
        ")",
        positionStart
      );

      const urlId: string = this.deletedShape.outerHTML.substring(
        positionStart + 5,
        positionEnd
      );
      const markerToRemove: SVGElement = (
        document.getElementById(urlId) as Element
      ).parentNode as SVGElement;
      this.markerDef.push(markerToRemove);
      this.drawingService.removeObject(markerToRemove.id);
    }
  }
}
