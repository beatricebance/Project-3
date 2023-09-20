import { Injectable, Type } from "@angular/core";
import { ControlMenuComponent } from "../../components/control-menu/control-menu.component";
import {
  ApplierToolParameterComponent,
  EllipseToolParameterComponent,
  EraserToolParameterComponent,
  LineToolParameterComponent,
  PencilToolParameterComponent,
  PolygonToolParameterComponent,
  RectangleToolParameterComponent,
  SelectionToolParameterComponent,
} from "src/app/modules/tool-parameters";

/// Classe permettant d'offrir dyamiquement des component selon un index
@Injectable({
  providedIn: "root",
})
export class ParameterComponentService {
  private parameterComponentList: Type<any>[] = [];
  constructor() {
    this.parameterComponentList.push(
      SelectionToolParameterComponent,
      EraserToolParameterComponent,
      PencilToolParameterComponent,
      RectangleToolParameterComponent,
      EllipseToolParameterComponent,
      PolygonToolParameterComponent,
      LineToolParameterComponent,
      ApplierToolParameterComponent
    );
    // Le push se fait par la suite pour s'assurer qu'il s'agit de la derniere classe
    this.parameterComponentList.push(ControlMenuComponent);
  }

  /// Retourne le parameterComponent de l'index donner
  getComponent(index: number): Type<any> {
    return this.parameterComponentList[index];
  }
}
