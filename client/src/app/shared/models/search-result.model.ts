import { User } from "src/app/modules/users/models/user";
import { Drawing } from "..";
import { Team } from "./team.model";

export interface SearchResult {
  users: User[];
  teams: Team[];
  drawings: Drawing[];
}
