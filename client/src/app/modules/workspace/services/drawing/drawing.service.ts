import { EventEmitter, Injectable, Output, Renderer2, Directive } from '@angular/core';
import { DEFAULT_RGB_COLOR, RGB, DEFAULT_ALPHA, RGBA } from 'src/app/shared';
import { DrawingHttpClientService } from 'src/app/modules/backend-communication';

/// Service qui contient les fonction pour dessiner a l'écran
@Directive()
@Injectable({
  providedIn: "root",
})
export class DrawingService {
  @Output()
  drawingEmit = new EventEmitter<SVGElement>();
  id: string;
  saved = false;
  svgString = new EventEmitter<string>();
  lastObjectId = 0;
  isCreated = false;
  color: RGB = DEFAULT_RGB_COLOR;
  alpha: number = DEFAULT_ALPHA;
  width = 0;
  height = 0;
  drawing: SVGElement;

  drawingId: string;

  private objectList: Map<string, SVGElement>;

  constructor(public renderer: Renderer2, private drawingHttpClientService:DrawingHttpClientService) {
    this.objectList = new Map<string, SVGElement>();
  }

  get rgbColorString(): string {
    return (
      "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")"
    );
  }

  get rgbaColorString(): string {
    return (
      "rgba(" +
      this.color.r +
      "," +
      this.color.g +
      "," +
      this.color.b +
      "," +
      this.alpha +
      ")"
    );
  }

  get isSaved(): boolean {
    return this.saved || !this.isCreated;
  }

  getObjectList(): Map<string, SVGElement> {
    return this.objectList;
  }

  get objects(): Map<string, SVGElement> {
    return this.objectList;
  }

  /// Retrait d'un objet selon son ID
  removeObject(id: string): void {
    this.renderer.removeChild(this.drawing, this.objectList.get(id));
    this.saved = false;
    this.objectList.delete(id);
  }

  /// Ajout d'un objet dans la map d'objet du dessin
  addObject(obj: SVGElement): string {
    this.saved = false;
    const id: string = obj.id;
    this.objectList.set(id, obj);
    this.renderer.insertBefore(
      this.drawing,
      obj,
      document.getElementById("gridRect") as Element as SVGElement
    );
    return id;
  }

  /// Récupère un objet selon son id dans la map d'objet
  getObject(id: string): SVGElement | undefined {
    return this.objectList.get(id);
  }

  /// Redéfinit la dimension du dessin
  setDimension(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setAttribute(this.drawing, "width", width.toString());
    this.renderer.setAttribute(this.drawing, "height", height.toString());
  }

  /// Change la couleur du fond d'écran
  setDrawingColor(rgba: RGBA): void {
    this.color = rgba.rgb;
    this.alpha = rgba.a;
    if (this.drawing) {
      this.renderer.setStyle(
        this.drawing,
        "backgroundColor",
        `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`
      );
    }
  }

  /// Fonction pour appeller la cascade de bonne fonction pour réinitialisé un nouveau dessin
  newDrawing(width: number, height: number, rgba: RGBA): string {
    this.saved = false;
    this.objectList.clear();
    this.lastObjectId = 0;
    this.drawing = this.renderer.createElement("svg", "svg");
    this.setDimension(width, height);
    this.setDrawingColor(rgba);
    this.drawingEmit.emit(this.drawing);
    return this.getDrawingDataUriBase64();
  }

  async saveDrawing(): Promise<void>{
    let dataUri = this.getDrawingDataUriBase64();
    await this.drawingHttpClientService.updateDrawing(this.drawingId, dataUri).toPromise();
  }

  /// Get drawing svg uri
  private getDrawingDataUriBase64(): string {
    return (
      "data:image/svg+xml;base64," +
      btoa(new XMLSerializer().serializeToString(this.drawing))
    );
  }

  getSvgFromDataUri(dataUri: string): SVGElement{
    let svgDomString = atob(dataUri.replace("data:image/svg+xml;base64,", ""));
    return new DOMParser().parseFromString(
      svgDomString,
      "image/svg+xml"
    ).children[0] as SVGElement;
  }

  openSvgFromDataUri(dataUri: string): void {
    const svg = this.getSvgFromDataUri(dataUri);
    this.openDrawing(svg);
  }

  /// Permer l'ouverture d'un dessin sous la forme du model Drawing
  openDrawing(drawing: SVGElement): void {
    this.saved = false;
    this.objectList.clear();
    this.lastObjectId = 0;
    this.drawing = drawing;
    let lastId;
    const background: string | null = this.drawing.style.backgroundColor;
    if (background) {
      const splitBackground =
        /(?:^rgba|^rgb)?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(
          background
        );
      const rgba: RGBA = { rgb: { r: 255, g: 255, b: 255 }, a: 1 };
      if (splitBackground) {
        rgba.rgb.r = Number(splitBackground[1]);
        rgba.rgb.g = Number(splitBackground[2]);
        rgba.rgb.b = Number(splitBackground[3]);
        if (splitBackground[4]) {
          rgba.a = Number(splitBackground[4]);
        }
      }
      this.setDrawingColor(rgba);
    } else {
      this.setDrawingColor({ rgb: DEFAULT_RGB_COLOR, a: DEFAULT_ALPHA });
    }
    const toDelete: SVGElement[] = [];
    for (let i = 0; i < this.drawing.children.length; i++) {
      lastId = (this.drawing.children.item(i) as SVGElement).id;
      if (lastId === "gridRect" || lastId === "gridDefs") {
        toDelete.push(this.drawing.children.item(i) as SVGElement);
      } else {
        this.objectList.set(
          lastId,
          this.drawing.children.item(i) as SVGElement
        );
        if (Number(lastId) > this.lastObjectId) {
          this.lastObjectId = Number(lastId);
        }
      }
    }

    toDelete.forEach((obj) => {
      this.drawing.removeChild(obj);
    });

    this.drawingEmit.emit(this.drawing);
  }

  publishDrawing():void{

  }
}
