import { Component, OnInit } from "@angular/core";
import { UsersService } from "src/app/modules/users/services/users.service";
import { UserStatistics } from "src/app/shared/models/user-statistics.model";

@Component({
  selector: "app-user-statistics",
  templateUrl: "./user-statistics.component.html",
  styleUrls: ["./user-statistics.component.scss"],
})
export class UserStatisticsComponent implements OnInit {
  userId: string;
  statistics: UserStatistics;

  statisticsLoaded: Promise<boolean>;

  constructor(private usersService: UsersService) {
    this.userId = localStorage.getItem("userId")!;
    this.usersService.getUserStatistics(this.userId).subscribe((statistics) => {
      this.statistics = statistics;
      this.statisticsLoaded = Promise.resolve(true);
    });
  }

  ngOnInit(): void {}
}
