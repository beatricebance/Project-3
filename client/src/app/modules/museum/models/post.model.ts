import { CommentInterface } from "./comment.model";
import { User } from "../../users/models/user";

export interface PostInterface extends Document {
  _id: string;
  dataUri: string;
  owner: string | User;
  ownerModel: string;
  name: string;

  comments: CommentInterface[];
  likes: string[];

  createdAt?: string;
  updatedAt?: string;
}
