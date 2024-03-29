import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { ICommand } from "src/app/modules/workspace/interfaces/command.interface";
import { Point, RGB } from "src/app/shared";
import { Tools } from "../../../interfaces/tools.interface";
import { DrawingService } from "../../drawing/drawing.service";
import { KeyCodes } from "../../hotkeys/hotkeys-constants";
import { OffsetManagerService } from "../../offset-manager/offset-manager.service";
import { RendererProviderService } from "../../renderer-provider/renderer-provider.service";
import { DrawingSocketService } from "../../synchronisation/sockets/drawing-socket/drawing-socket.service";
import { ToolIdConstants } from "../tool-id-constants";
import { LEFT_CLICK } from "../tools-constants";
import { SelectionCommandConstants } from "./command-type-constant";
import { SelectionTransformService } from "./selection-transform.service";
import { Selection } from "./selection.model";
import { Translation } from "./translate-command/translate.model";
import { SynchronisationService } from "../../synchronisation/synchronisation.service";
import { Subject } from "rxjs";
import { PrimaryColorCommand } from "./primary-color-command/primary-color-command.service";
import { SecondaryColorCommand } from "./secondary-color-command/secondary-color-command.service";
import { LineWidthCommand } from "./line-width-command/line-width-command.service"

@Injectable({
  providedIn: "root",
})
export class SelectionToolService implements Tools {
  readonly id: number = ToolIdConstants.SELECTION_ID;
  readonly faIcon: IconDefinition = faMousePointer;
  readonly toolName = "Sélection";
  parameters: FormGroup;

  private hasSelectedItems = false;
  private isAlt = false;
  private isShift = false;

  private pointsSideLength = 10;
  private pointsList: Point[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  private ctrlPoints: SVGRectElement[] = [];
  private ctrlG: SVGGElement;
  private rectSelection: SVGPolygonElement;

  private recStrokeWidth = 1;

  private objects: SVGElement[] = [];
  private currentSelection: Selection;
  private wasMoved = false;
  private isIn = false;

  private translation: Translation;

  public lineWidthSubject: Subject<number> = new Subject();

  constructor(
    private drawingService: DrawingService,
    private offsetManager: OffsetManagerService,
    private rendererService: RendererProviderService,
    private selectionTransformService: SelectionTransformService,
    private drawingSocketService: DrawingSocketService,
    private synchronisationService: SynchronisationService
  ) {
    this.setRectSelection();
    this.setCtrlPoints();
  }

  /// Quand le bouton gauche de la sourie est enfoncé, soit on selectionne un objet, soit on debute une zone de selection
  /// soit on s'aprete a deplacer un ou plusieurs objet ou soit on enleve une selection.
  /// Avec le bouton droit, on debute une zone d'inversion.
  onPressed(event: MouseEvent): void {
    if (event.button === LEFT_CLICK && this.drawingService.drawing) {
      const offset: { x: number; y: number } =
        this.offsetManager.offsetFromMouseEvent(event);
      let target = event.target as SVGElement;
      if (this.ctrlPoints.includes(target as SVGRectElement)) {
        this.selectionTransformService.createCommand(
          SelectionCommandConstants.RESIZE,
          this.rectSelection,
          this.objects,
          offset,
          target as SVGRectElement
        );
        return;
      }

      const obj = this.drawingService.getObject(target.id);
      if (event.button === LEFT_CLICK) {
        if (this.isInside(offset.x, offset.y)) {
          this.isIn = true;
          if (!this.selectionTransformService.hasCommand()) {
            this.selectionTransformService.setCommandType(
              SelectionCommandConstants.NONE
            );
          }
        } else {
          this.ctrlPoints.forEach((point) => {
            this.rendererService.renderer.setAttribute(
              point,
              "x",
              `${offset.x}`
            );
            this.rendererService.renderer.setAttribute(
              point,
              "y",
              `${offset.y}`
            );
          });

          // This happens when we have a selection and we confirm it, in which case the
          // selection is pasted back onto the canvas, and we can redo another selection.

          if (this.objects.length > 0) {
            this.removeSelection();
            this.resetLineWidthSubject();
          }

          // Initializes the selection
          if (
            obj &&
            (this.objects.length < 2 || !this.objects.includes(obj)) &&
            !this.synchronisationService.previewShapes.has(target.id)
          ) {
            if (obj.tagName == "g") return;
            this.objects.push(obj);

            // Initializes the selection model that will be synchronised
            this.currentSelection = {
              id: obj.id,
            };

            // Send current lineWidth event to lineWidth subject
            this.changeLineWidthParameterComponent(obj);

            this.drawingSocketService.sendStartSelectionCommand(
              this.currentSelection,
              "SelectionStart"
            );

            this.setSelection();
            this.isIn = true;

            this.selectionTransformService.setCommandType(
              SelectionCommandConstants.NONE
            );

            this.rendererService.renderer.appendChild(
              this.drawingService.drawing,
              this.rectSelection
            );

            this.rendererService.renderer.appendChild(
              this.drawingService.drawing,
              this.ctrlG
            );
            return;
          }
        }
      }

      if (this.hasSelectedItems) {
        return;
      }
    }
  }

  /// Quand le bouton de la sourie gauche est relache, soit on selectionne un objet, soit on termine une zone de selection
  /// et on recherche les objets a l'interieur. Avec le droit, on termine la zone d'inversement et on inverse
  /// la selection des objets se situant a l'interieur.
  onRelease(event: MouseEvent): ICommand | void {
    if (event.button === LEFT_CLICK && this.drawingService.drawing) {
      if (this.objects.length > 0) {
        this.setSelection();
      }
      // else {
      //   this.removeSelection();
      // }

      this.isIn = false;
      let returnRectangleCommand;
      if (this.wasMoved) {
        if (this.selectionTransformService.hasCommand()) {
          returnRectangleCommand = this.selectionTransformService.getCommand();
          this.selectionTransformService.endCommand();
        }
        this.wasMoved = false;

        return returnRectangleCommand;
      }

      this.selectionTransformService.endCommand();
    }
  }

  /// Quand le bouton de la sourie gauche est enfonce et que le bouge la sourie, soit on selectionne un objet,
  /// soit on modifie la dimension du rectangle de selection, soit on deplace un ou plusieurs objets.
  /// Avec le droit, on modifie la dimension du rectangle d'inversement.
  onMove(event: MouseEvent): void {
    const offset: { x: number; y: number } =
      this.offsetManager.offsetFromMouseEvent(event);
    if (this.drawingService.drawing) {
      if (event.buttons === 1) {
        this.wasMoved = true;

        if (
          this.selectionTransformService.getCommandType() ===
          SelectionCommandConstants.RESIZE
        ) {
          this.selectionTransformService.resize(
            event.movementX,
            event.movementY,
            offset
          );
          this.setSelection();
          return;
        }

        if (this.isIn) {
          if (
            this.selectionTransformService.getCommandType() !==
            SelectionCommandConstants.TRANSLATE
          ) {
            this.selectionTransformService.createCommand(
              SelectionCommandConstants.TRANSLATE,
              this.rectSelection,
              this.objects
            );

            // Initializes the translation
            // At the start, the deltaX and deltaY are 0 as the object hasn't moved.
            this.translation = {
              id: this.objects[0].id,
              deltaX: 0,
              deltaY: 0,
            };
            this.drawingSocketService.sendTransformSelectionCommand(
              this.translation,
              "Translation"
            );
          } else {
            // Increments the previous translation.
            this.translation.deltaX += event.movementX;
            this.translation.deltaY += event.movementY;

            this.selectionTransformService.translate(
              this.translation.deltaX,
              this.translation.deltaY
            );

            const translationSync = {
              id: this.objects[0].id,
              deltaX: event.movementX,
              deltaY: event.movementY,
            };
            this.drawingSocketService.sendTransformSelectionCommand(
              translationSync,
              "Translation"
            );
          }
          this.setSelection();
        }
      }
    }
  }

  // Alt and shift alter the behavior when resizing
  // With shift, the resize follows a square transformation
  // With alt, the size is mirrored on both sides
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isAlt) {
      this.isAlt = event.code === KeyCodes.altR || event.code === KeyCodes.altL;
    }
    if (!this.isShift) {
      this.isShift =
        event.code === KeyCodes.shiftR || event.code === KeyCodes.shiftL;
    }

    this.wasMoved = true;

    if (this.isAlt) {
      this.selectionTransformService.setAlt(true);
    }
    if (this.isShift) {
      this.selectionTransformService.setShift(true);
      this.setSelection();
    }

    if (
      this.selectionTransformService.getCommandType() ===
      SelectionCommandConstants.RESIZE
    ) {
      this.selectionTransformService.resizeWithLastOffset();
      this.setSelection();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.isAlt) {
      this.isAlt = !(
        event.code === KeyCodes.altR || event.code === KeyCodes.altL
      );
    }
    if (this.isShift) {
      this.isShift = !(
        event.code === KeyCodes.shiftR || event.code === KeyCodes.shiftL
      );
    }

    this.wasMoved = true;

    if (!this.isAlt) {
      this.selectionTransformService.setAlt(false);
    }
    if (!this.isShift) {
      this.selectionTransformService.setShift(false);
      this.setSelection();
    }

    if (
      this.selectionTransformService.getCommandType() ===
      SelectionCommandConstants.RESIZE
    ) {
      this.selectionTransformService.resizeWithLastOffset();
      this.setSelection();
    }
  }

  private changeLineWidthParameterComponent(obj: SVGElement): void {
    if (obj.style.strokeWidth != "" || obj.getAttribute("r") != "") {
      const propertyString =
        obj.tagName == "circle" ? obj.getAttribute("r") : obj.style.strokeWidth;
      if (propertyString != null && propertyString != "") {
        const objectLineWidth = parseInt(propertyString);
        this.lineWidthSubject.next(objectLineWidth);
      }
    } else {
      this.resetLineWidthSubject();
    }
  }

  private resetLineWidthSubject(): void {
    this.lineWidthSubject.next(1);
  }

  setSelectionLineWidth(strokeWidth: number): void {
    if (this.objects.length > 0) {
      const currentObject = this.objects[0];
      let lineWidthCommand = new LineWidthCommand(currentObject, strokeWidth, this.rendererService);
      lineWidthCommand.execute();
      this.drawingSocketService.sendSelectionLineWidthChange(currentObject.id, strokeWidth);
    }
  }

  pickupTool(): void {
    return;
  }

  dropTool(): void {
    if (this.objects.length > 0) {
      const confirmedSelection: Selection = {
        id: this.objects[0].id,
      };

      this.drawingSocketService.sendConfirmSelectionCommand(
        confirmedSelection,
        "ConfirmSelection"
      );

      this.removeSelection();
    }
    return;
  }

  /// Methode qui calcule la surface que le rectangle de selection doit prendre en fonction des objets selectionnes.
  private setSelection(): void {
    if (this.hasSelection()) {
      this.hasSelectedItems = true;
      this.rendererService.renderer.setAttribute(
        this.rectSelection,
        "transform",
        ``
      );
      this.ctrlPoints.forEach((point) => {
        this.rendererService.renderer.setAttribute(point, "transform", "");
      });

      let boundingRect = this.objects[0].getBoundingClientRect();

      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;

      let objStrokeWidth = 0;
      if (this.objects[0].style.stroke !== "none") {
        objStrokeWidth = this.strToNum(this.objects[0].style.strokeWidth);
      }
      let markerID: string | null =
        this.objects[0].getAttribute("marker-start");
      if (markerID) {
        objStrokeWidth = Number(markerID.substring(5, markerID.indexOf("-")));
      }

      if (this.objects.length === 1 || !this.wasMoved) {
        x = boundingRect.left - this.xFactor() - objStrokeWidth / 2;
        y = boundingRect.top - objStrokeWidth / 2;
        width = boundingRect.width + objStrokeWidth;
        height = boundingRect.height + objStrokeWidth;
      } else {
        let xL = boundingRect.left - objStrokeWidth / 2;
        let xR = boundingRect.right + objStrokeWidth / 2;

        let yT = boundingRect.top - objStrokeWidth / 2;
        let yB = boundingRect.bottom + objStrokeWidth / 2;

        this.objects.forEach((elm) => {
          let value;
          boundingRect = elm.getBoundingClientRect();

          objStrokeWidth = 0;
          if (elm.style.stroke !== "none") {
            objStrokeWidth = this.strToNum(elm.style.strokeWidth);
          }
          markerID = elm.getAttribute("marker-start");
          if (markerID) {
            objStrokeWidth = Number(
              markerID.substring(5, markerID.indexOf("-"))
            );
          }

          value = boundingRect.left - objStrokeWidth / 2;
          if (value < xL) {
            xL = value;
          }

          value = boundingRect.right + objStrokeWidth / 2;
          if (value > xR) {
            xR = value;
          }

          value = boundingRect.top - objStrokeWidth / 2;
          if (value < yT) {
            yT = value;
          }

          value = boundingRect.bottom + objStrokeWidth / 2;
          if (value > yB) {
            yB = value;
          }
        });

        x = xL - this.xFactor();
        y = yT;
        width = xR - xL;
        height = yB - yT;
      }

      this.pointsList[0].x = x;
      this.pointsList[0].y = y;
      this.pointsList[1].x = x + width / 2;
      this.pointsList[1].y = y;
      this.pointsList[2].x = x + width;
      this.pointsList[2].y = y;
      this.pointsList[3].x = x + width;
      this.pointsList[3].y = y + height / 2;
      this.pointsList[4].x = x + width;
      this.pointsList[4].y = y + height;
      this.pointsList[5].x = x + width / 2;
      this.pointsList[5].y = y + height;
      this.pointsList[6].x = x;
      this.pointsList[6].y = y + height;
      this.pointsList[7].x = x;
      this.pointsList[7].y = y + height / 2;

      this.rendererService.renderer.setAttribute(
        this.rectSelection,
        "points",
        this.pointsToString()
      );
      for (let i = 0; i < 8; i++) {
        this.rendererService.renderer.setAttribute(
          this.ctrlPoints[i],
          "x",
          `${this.pointsList[i].x + 0.5 - this.pointsSideLength / 2}`
        );
        this.rendererService.renderer.setAttribute(
          this.ctrlPoints[i],
          "y",
          `${this.pointsList[i].y + 0.5 - this.pointsSideLength / 2}`
        );
      }
    }
  }

  /// Methode qui suprime la selection courante .
  removeSelection(): void {
    const confirmedSelection: Selection = {
      id: this.objects[0].id,
    };

    this.synchronisationService.removeFromPreview(confirmedSelection.id);

    this.drawingSocketService.sendConfirmSelectionCommand(
      confirmedSelection,
      "ConfirmSelection"
    );

    this.objects = [];
    this.hasSelectedItems = false;

    this.rendererService.renderer.removeChild(
      this.drawingService.drawing,
      this.rectSelection
    );
    this.rendererService.renderer.removeChild(
      this.drawingService.drawing,
      this.ctrlG
    );

    this.rendererService.renderer.setAttribute(
      this.rectSelection,
      "points",
      ""
    );
  }
  /// Methode pour cacher la selection en gardant en memoire les element
  hideSelection(): void {
    this.rendererService.renderer.setAttribute(
      this.ctrlG,
      "visibility",
      "hidden"
    );
    this.rendererService.renderer.setAttribute(
      this.rectSelection,
      "visibility",
      "hidden"
    );
  }
  // Rendre la selection visible
  showSelection(): void {
    this.rendererService.renderer.setAttribute(
      this.ctrlG,
      "visibility",
      "visible"
    );
    this.rendererService.renderer.setAttribute(
      this.rectSelection,
      "visibility",
      "visible"
    );
  }

  /// Initialise le rectangle de selection.
  private setRectSelection(): void {
    this.rectSelection = this.rendererService.renderer.createElement(
      "polygon",
      "svg"
    );
    this.rendererService.renderer.setStyle(
      this.rectSelection,
      "stroke",
      `rgba(0, 0, 200, 1)`
    );
    this.rendererService.renderer.setStyle(
      this.rectSelection,
      "stroke-width",
      `${this.recStrokeWidth}`
    );
    this.rendererService.renderer.setStyle(
      this.rectSelection,
      "stroke-dasharray",
      `10,10`
    );
    this.rendererService.renderer.setStyle(
      this.rectSelection,
      "d",
      `M5 40 l215 0`
    );
    this.rendererService.renderer.setStyle(this.rectSelection, "fill", `none`);
    this.rendererService.renderer.setAttribute(
      this.rectSelection,
      "points",
      ""
    );
    this.rendererService.renderer.setAttribute(
      this.rectSelection,
      "pointer-events",
      "none"
    );
  }

  /// Initialise les points de controle.
  private setCtrlPoints(): void {
    this.ctrlG = this.rendererService.renderer.createElement("g", "svg");

    for (let i = 0; i < 8; i++) {
      const point = this.rendererService.renderer.createElement("rect", "svg");
      this.rendererService.renderer.setStyle(point, "stroke", `black`);
      this.rendererService.renderer.setStyle(point, "stroke-width", `1`);
      this.rendererService.renderer.setStyle(point, "fill", `white`);

      this.rendererService.renderer.setAttribute(
        point,
        "width",
        `${this.pointsSideLength}`
      );
      this.rendererService.renderer.setAttribute(
        point,
        "height",
        `${this.pointsSideLength}`
      );

      this.ctrlPoints.push(point);

      this.rendererService.renderer.appendChild(this.ctrlG, point);
    }

    this.selectionTransformService.setCtrlPointList(this.ctrlPoints);
  }

  /// Retourne la liste d'objets selectionne.
  getObjectList(): SVGElement[] {
    return this.objects;
  }

  /// Retourne la position superieur gauche du rectangle de selection.
  getRectSelectionOffset(): Point {
    return this.pointsList[0];
  }

  /// Retourne si il y a une selection ou non.
  hasSelection(): boolean {
    return this.objects.length > 0;
  }

  /// Applique une selection sur une liste d'objets fourni.
  setNewSelection(newSelectionList: SVGElement[]): void {
    this.removeSelection();
    newSelectionList.forEach((value) => {
      if (value.tagName.toLowerCase() !== "defs") {
        this.objects.push(value);
      }
    });
    if (this.objects.length > 0) {
      this.wasMoved = true;
      this.rendererService.renderer.appendChild(
        this.drawingService.drawing,
        this.rectSelection
      );
      this.rendererService.renderer.appendChild(
        this.drawingService.drawing,
        this.ctrlG
      );
      this.setSelection();
    }
  }

  /// Verifie si le curseur se situe a l'interieur de la selection.
  private isInside(x: number, y: number): boolean {
    const rectBox = this.rectSelection.getBoundingClientRect();
    return (
      x >= rectBox.left - this.xFactor() &&
      x <= rectBox.right - this.xFactor() &&
      y >= rectBox.top &&
      y <= rectBox.bottom
    );
  }

  /// Transforme les chiffre en string suivie de 'px' en number.
  private strToNum(str: string | null): number {
    return str
      ? +str
          .replace(/[^-?\d]+/g, ",")
          .split(",")
          .filter((el) => el !== "")
      : 0;
  }

  /// Transforme la liste de points de controle en un string.
  private pointsToString(): string {
    let pointsStr = "";
    this.pointsList.forEach((point) => {
      pointsStr += `${point.x},${point.y} `;
    });
    return pointsStr.substring(0, pointsStr.length - 1);
  }

  /// Retourne le deplacement de la barre de menu.
  private xFactor(): number {
    return (
      this.drawingService.drawing as SVGSVGElement
    ).getBoundingClientRect().left;
  }


  setSelectedObjectPrimaryColor(primaryColor: RGB, opacity: number) {
    if (!this.objects || this.objects.length == 0) return;

    const selectedObject = this.objects[0];
    let primaryColorCommand = new PrimaryColorCommand(selectedObject, primaryColor, opacity);
    primaryColorCommand.execute();
    this.drawingSocketService.sendObjectPrimaryColorChange(selectedObject.id, primaryColor, opacity);
  }

  setSelectedObjectSecondaryColor(secondaryColor: RGB, opacity: number) {
    if (!this.objects) return;
    const selectedObject = this.objects[0];
    let secondaryColorCommand = new SecondaryColorCommand(selectedObject, secondaryColor, opacity);
    secondaryColorCommand.execute();
    this.drawingSocketService.sendObjectSecondaryColorChange(selectedObject.id, secondaryColor, opacity);
  }
}
