import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { User } from "../models/user";
import { UsersService } from "../services/users.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  user: User;
  userId: string;

  userLoaded: Promise<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.userId = params["id"];
      this.usersService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this.userLoaded = Promise.resolve(true);
      });
    });
  }

  ngOnInit(): void {}
}
