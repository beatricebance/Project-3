import { ICommand } from 'src/app/modules/workspace/interfaces/command.interface';
import { RGB } from 'src/app/shared';

export class PrimaryColorCommand implements ICommand{

  constructor(
    private colorShape: SVGElement,
    private color: RGB,
    private opacity: number
  ) { }

  update(drawingCommand: any): void {
    throw new Error("Method not implemented.");
  }

  /// Rajout des elements suprimé
  undo(): void {
    throw new Error("Method undefined.");
  }

  execute(): void {
    const selectedObject = this.colorShape;
    if(selectedObject){
    const r = this.color.r;
    const b = this.color.b;
    const g = this.color.g;
    const color = `rgb(${r},${g},${b}`;
    const opacityString = `${this.opacity}`;
    if (selectedObject.tagName == "polyline") {
      selectedObject.style.stroke = color;
      selectedObject.style.strokeOpacity = opacityString;
      return;
    }
    selectedObject.style.fill = color;
    selectedObject.style.fillOpacity = opacityString;
    }
  }
}
