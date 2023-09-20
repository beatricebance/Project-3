import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DrawingComponent } from "./drawing/drawing.component";

const routes: Routes = [{ path: ":id", component: DrawingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrawingsRoutingModule {}
