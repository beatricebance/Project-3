import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SearchRoutingModule } from "./search-routing.module";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { FlexModule } from "@angular/flex-layout";
import { UserCardComponent } from "./cards/user-card/user-card.component";
import { MatCardModule } from "@angular/material/card";
import { TeamCardComponent } from "./cards/team-card/team-card.component";
import { AvatarModule } from "ngx-avatar";
import { MatTabsModule } from "@angular/material/tabs";
import { CardsModule } from "../cards/cards.module";

@NgModule({
  declarations: [SearchResultsComponent, UserCardComponent, TeamCardComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    FlexModule,
    MatCardModule,
    AvatarModule,
    MatTabsModule,
    CardsModule,
  ],
})
export class SearchModule {}
