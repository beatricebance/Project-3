import mongoose, { Document, Model, Schema } from 'mongoose';
import { CommentInterface } from './Comment';
import { UserInterface } from './user';

export interface PostInterface extends Document {
  dataUri: string;
  owner: string | UserInterface;
  ownerModel: string;
  name: string;

  comments: string[] | CommentInterface[];
  likes: string[];

  createdAt: string;
  updatedAt: string;
}

const PostSchema = new Schema(
  {
    dataUri: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerModel',
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ['User', 'Team'],
    },
    name: {
      type: String,
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const Post: Model<PostInterface> = mongoose.model('Post', PostSchema);
