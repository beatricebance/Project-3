import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CollaborationInterface extends Document {
  drawing: string;
  timeSpent: number;
}

export const CollaborationSchema = new mongoose.Schema({
  drawing: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Drawing',
  },
  timeSpent: {
    type: Number,
  },
});

export const Collaboration: Model<CollaborationInterface> = mongoose.model(
  'Collaboration',
  CollaborationSchema,
);
