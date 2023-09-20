import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MaterialModules } from "../../app-material.module";
import { ApplierToolParameterComponent } from "./components/applier-tool-parameter/applier-tool-parameter.component";
import { EllipseToolParameterComponent } from "./components/ellipse-tool-parameter/ellipse-tool-parameter.component";
import { EraserToolParameterComponent } from "./components/eraser-tool-parameter/eraser-tool-parameter.component";
import { LineToolParameterComponent } from "./components/line-tool-parameter/line-tool-parameter.component";
import { PencilToolParameterComponent } from "./components/pencil-tool-parameter/pencil-tool-parameter.component";
import { PolygonToolParameterComponent } from "./components/polygon-tool-parameter/polygon-tool-parameter.component";
import { RectangleToolParameterComponent } from "./components/rectangle-tool-parameter/rectangle-tool-parameter.component";
import { SelectionToolParameterComponent } from "./components/selection-tool-parameter/selection-tool-parameter.component";
import { WorkspaceModule } from "src/app/modules/workspace/workspace.module";

@NgModule({
  declarations: [
    PencilToolParameterComponent,
    RectangleToolParameterComponent,
    ApplierToolParameterComponent,
    EllipseToolParameterComponent,
    PolygonToolParameterComponent,
    LineToolParameterComponent,
    SelectionToolParameterComponent,
    EraserToolParameterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    FontAwesomeModule,
    WorkspaceModule,
  ],
  exports: [PencilToolParameterComponent],
  entryComponents: [
    PencilToolParameterComponent,
    RectangleToolParameterComponent,
    ApplierToolParameterComponent,
    EllipseToolParameterComponent,
    PolygonToolParameterComponent,
    LineToolParameterComponent,
    SelectionToolParameterComponent,
    EraserToolParameterComponent,
  ],
})
export class ToolParameterModule {}
