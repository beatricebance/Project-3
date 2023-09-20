import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserInterface } from './user';

export interface CommentInterface extends Document {
  content: string;
  author: string | UserInterface;
  postId: string;

  createdAt: string;
  updatedAt: string;
}

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
  },
  { timestamps: true },
);

export const Comment: Model<CommentInterface> = mongoose.model(
  'Comment',
  CommentSchema,
);
