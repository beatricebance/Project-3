import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToolsColorComponent } from "./tools-color.component";
import { ToolsColorPickerComponent } from "./tools-color-picker/tools-color-picker.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ColorPickerModule } from "../color-picker/color-picker.module";
import { ReactiveFormsModule } from "@angular/forms";
import { BackgroundColorPickerComponent } from "./background-color-picker/background-color-picker.component";

@NgModule({
  declarations: [
    ToolsColorComponent,
    ToolsColorPickerComponent,
    BackgroundColorPickerComponent,
  ],
  imports: [CommonModule, SharedModule, ColorPickerModule, ReactiveFormsModule],
  exports: [ToolsColorComponent, BackgroundColorPickerComponent],
})
export class ToolsColorModule {}
