import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UsersService } from "src/app/modules/users/services/users.service";

@Component({
  selector: "app-user-history",
  templateUrl: "./user-history.component.html",
  styleUrls: ["./user-history.component.scss"],
})
export class UserHistoryComponent implements OnInit {
  userLoaded: Promise<boolean>;
  currentUser: any;

  constructor(private usersService: UsersService, private router: Router) {
    this.usersService
      .getUser(localStorage.getItem("userId")!)
      .subscribe((user) => {
        this.currentUser = user;
        this.userLoaded = Promise.resolve(true);
      });
  }

  ngOnInit(): void {}

  goToDrawing(drawingId: string) {
    this.router.navigate([`/drawings/${drawingId}`]);
  }
}
