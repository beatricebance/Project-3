import { User } from "../../users/models/user";

export interface CommentInterface extends Document {
  content: string;
  author: User;
  postId: string;

  createdAt?: string;
  updatedAt?: string;
}
