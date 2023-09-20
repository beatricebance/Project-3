import { User } from "src/app/modules/users/models/user";
import { Drawing } from "..";

export interface Team {
  _id: string;

  name: string;
  description: string;

  owner: string;

  members: string[] | User[];
  memberLimit: number;

  isPrivate: boolean;
  password: string;

  drawings: string[] | Drawing[];
}
