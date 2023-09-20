import { Avatar } from "src/app/shared/models/avatar.model";

export class User {
  _id: string;
  username: string;
  avatar: Avatar;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
