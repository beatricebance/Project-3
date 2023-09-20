import { User } from "src/app/modules/users/models/user";
import { Team } from "./team.model";

export interface Drawing {
  _id: string;
  dataUri: string;
  owner: string | User | Team;
  ownerModel: string;
  name: string;

  privacyLevel: string;
  password: string;

  createdAt: string;
  updatedAt: string;
}
