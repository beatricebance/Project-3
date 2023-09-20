import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsContainerComponent } from "./settings-container/settings-container.component";
import { UserHistoryComponent } from "./settings-container/user-history/user-history.component";
import { UserOverviewComponent } from "./settings-container/user-overview/user-overview.component";
import { UserStatisticsComponent } from "./settings-container/user-statistics/user-statistics.component";

const routes: Routes = [
  {
    path: "",
    component: SettingsContainerComponent,
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        component: UserOverviewComponent,
      },
      {
        path: "history",
        component: UserHistoryComponent,
      },
      {
        path: "statistics",
        component: UserStatisticsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
