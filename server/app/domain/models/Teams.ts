import mongoose, { Document, Model, Schema } from 'mongoose';
import { DrawingInterface } from './Drawing';
import { PostInterface } from './Post';
import { UserInterface } from './user';

export interface TeamInterface extends Document {
  name: string;
  description: string;

  owner: string;
  members: string[] | UserInterface[];
  memberLimit: number;

  isPrivate: boolean;
  password: string;

  drawings: string[] | DrawingInterface[];
  posts: string[] | PostInterface[];
}

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String },

  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  memberLimit: { type: Number, min: 1 },

  isPrivate: { type: Boolean },
  password: { type: String },

  drawings: [{ type: Schema.Types.ObjectId, ref: 'Drawing' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

export const Team: Model<TeamInterface> = mongoose.model('Team', TeamSchema);
