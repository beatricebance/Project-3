import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TeamMainPageComponent } from "./team-main-page/team-main-page/team-main-page.component";
import { TeamProfileComponent } from "./team-profile/team-profile/team-profile.component";

const routes: Routes = [
  { path: "", component: TeamMainPageComponent },
  { path: ":id", component: TeamProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
