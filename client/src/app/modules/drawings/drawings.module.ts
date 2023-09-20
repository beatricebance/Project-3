import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DrawingsRoutingModule } from "./drawings-routing.module";
import { DrawingComponent } from "./drawing/drawing.component";
import { SidenavModule } from "../sidenav/sidenav.module";

@NgModule({
  declarations: [DrawingComponent],
  imports: [CommonModule, SidenavModule, DrawingsRoutingModule],
})
export class DrawingsModule {}
