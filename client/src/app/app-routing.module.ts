import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./modules/authentication/";
import { PageNotFoundComponent } from "./modules/error/";

const routes: Routes = [
  {
    path: "users",
    loadChildren: () =>
      import("./modules/users/users.module").then((m) => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: "teams",
    loadChildren: () =>
      import("./modules/team/team.module").then((m) => m.TeamModule),
    canActivate: [AuthGuard],
  },
  {
    path: "museum",
    loadChildren: () =>
      import("./modules/museum/museum.module").then((m) => m.MuseumModule),
    canActivate: [AuthGuard],
  },
  {
    path: "drawings",
    loadChildren: () =>
      import("./modules/drawings/drawings.module").then(
        (m) => m.DrawingsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "gallery",
    loadChildren: () =>
      import("./modules/gallery/gallery.module").then((m) => m.GalleryModule),
    canActivate: [AuthGuard],
  },
  {
    path: "search",
    loadChildren: () =>
      import("./modules/search/search.module").then((m) => m.SearchModule),
    canActivate: [AuthGuard],
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./modules/settings/settings.module").then(
        (m) => m.SettingsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "/gallery",
    pathMatch: "full",
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    loadChildren: () =>
      import("./modules/error/error.module").then((m) => m.ErrorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
