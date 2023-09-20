import { Renderer2 } from "@angular/core";
import { ICommand } from "../../../../interfaces/command.interface";

export class ResizeCommand implements ICommand {
  private previousTransformation: Map<string, string> = new Map<
    string,
    string
  >();
  object: SVGElement;
  private xScaled: number = 1;
  private yScaled: number = 1;
  private xTranslate: number = 0;  
  private yTranslate: number = 0;

  constructor(private renderer: Renderer2, objectList: SVGElement[]) {
    this.object = objectList[0];
    const transform: string | null = this.object.getAttribute("transform");
      if (transform) {
        this.previousTransformation.set(this.object.id, transform);
      } else {
        this.previousTransformation.set(this.object.id, "");
      }
  }

  update(drawingCommand: any): void {
    this.setScales(drawingCommand.xScaled, drawingCommand.yScaled, drawingCommand.xTranslate, drawingCommand.yTranslate)
    for(let key_transformation of this.previousTransformation){
      this.previousTransformation.set(key_transformation[0], drawingCommand.previousTransform)
    }
  }

  getLastTransformation(): string {
    return this.previousTransformation.get(
      this.object.id
    ) as string;
  }

  setScales(
    xScaled: number,
    yScaled: number,
    xTranslate: number,
    yTranslate: number
  ): void {
    this.xScaled = xScaled;
    this.yScaled = yScaled;
    this.xTranslate = xTranslate;
    this.yTranslate = yTranslate
  }

  private resize(
    xScaled: number,
    yScaled: number,
    xTranslate: number,
    yTranslate: number
  ): void {
    const scaleString =
      ` translate(${xTranslate} ${yTranslate})` +
      ` scale(${xScaled} ${yScaled})` +
      ` translate(${-xTranslate} ${-yTranslate})`;
    const lastTransformation = this.previousTransformation.get(
      this.object.id
    ) as string;
    this.renderer.setAttribute(
      this.object,
      "transform",
      scaleString + lastTransformation
    );
  }
  
  undo(): void {
    this.renderer.setAttribute(
      this.object,
      "transform",
      this.previousTransformation.get(this.object.id) as string
    );
  }

  execute(): void {
    this.resize(
      this.xScaled,
      this.yScaled,
      this.xTranslate,
      this.yTranslate
    );
  }
}
