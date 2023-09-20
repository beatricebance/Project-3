import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TellMeAboutYourselfComponent } from "./tell-me-about-yourself/tell-me-about-yourself/tell-me-about-yourself.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";

const userRoutes: Routes = [
  { path: "customize", component: TellMeAboutYourselfComponent },
  { path: ":id", component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
