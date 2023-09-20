import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ColorOpacityComponent } from "./components/color-opacity/color-opacity.component";
import { ColorPaletteComponent } from "./components/color-palette/color-palette.component";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { ColorRgbaHexComponent } from "./components/color-rgba-hex/color-rgba-hex.component";
import { ColorSliderComponent } from "./components/color-slider/color-slider.component";
import { ColorSquareComponent } from "./components/color-square/color-square.component";
import { MaterialModules } from "src/app/app-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [
    ColorOpacityComponent,
    ColorPaletteComponent,
    ColorPickerComponent,
    ColorRgbaHexComponent,
    ColorSliderComponent,
    ColorSquareComponent,
    ColorPickerComponent,
  ],
  imports: [CommonModule, MaterialModules, FormsModule, ReactiveFormsModule],
  exports: [ColorPickerComponent],
})
export class ColorPickerModule {}
