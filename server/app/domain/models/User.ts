import bcrypt from 'bcrypt';
import mongoose, { Document, Model, Schema } from 'mongoose';
import { AvatarInterface, AvatarSchema } from './Avatar';
import { CollaborationInterface, CollaborationSchema } from './Collaboration';
import {
  CollaborationHistoryInterface,
  CollaborationHistorySchema,
} from './CollaborationHistory';
import { PostInterface } from './Post';
import { TeamInterface } from './teams';

export interface UserInterface extends Document {
  username: string;
  description: string;
  avatar: AvatarInterface;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  teams: string[] | TeamInterface[];

  drawings: string[];
  posts: string[] | PostInterface[];

  followers: string[] | UserInterface[];
  following: string[] | UserInterface[];

  lastLogin: Date;
  lastLogout: Date;

  collaborations: CollaborationInterface[];
  collaborationHistory: CollaborationHistoryInterface[];

  isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  description: String,
  avatar: {
    type: AvatarSchema,
    default: {
      imageUrl: 'https://colorimage-111.s3.amazonaws.com/default/default.jpeg',
    },
  },

  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],

  drawings: [{ type: Schema.Types.ObjectId, ref: 'Drawing' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  lastLogin: { type: Date },
  lastLogout: { type: Date },

  collaborations: [{ type: CollaborationSchema }],
  collaborationHistory: [{ type: CollaborationHistorySchema }],
});

UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

export const User: Model<UserInterface> = mongoose.model('User', UserSchema);
