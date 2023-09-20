import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlertMessageComponent } from "./alert-message/alert-message.component";
import { ErrorMessageComponent } from "./error-message/error-message.component";
import { MaterialModules } from "src/app/app-material.module";

@NgModule({
  exports: [MaterialModules],
  declarations: [AlertMessageComponent, ErrorMessageComponent],
  imports: [CommonModule, MaterialModules],
})
export class SharedModule {}
