import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ToolParameterModule } from "../tool-parameters/tool-parameter.module";
import { PencilToolParameterComponent } from "src/app/modules/tool-parameters";
import { ParameterMenuModule } from "../parameter-menu/parameter-menu.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MaterialModules } from "src/app/app-material.module";
import { ToolsColorModule } from "../tools-color/tools-color.module";
import { SidenavComponent } from ".";

@NgModule({
  imports: [
    CommonModule,
    ParameterMenuModule,
    ToolParameterModule,
    FontAwesomeModule,
    MaterialModules,
    ToolsColorModule,
  ],
  declarations: [SidenavComponent],
  entryComponents: [PencilToolParameterComponent],
  exports: [SidenavComponent],
})
export class SidenavModule {}
