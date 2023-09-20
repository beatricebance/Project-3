import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CollaborationHistoryInterface extends Document {
  drawing: string;
  collaboratedAt: Date;
}

export const CollaborationHistorySchema = new mongoose.Schema({
  drawing: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Drawing',
  },
  collaboratedAt: {
    type: Date,
    required: true,
  },
});

export const CollaborationHistory: Model<CollaborationHistoryInterface> =
  mongoose.model('CollaborationHistory', CollaborationHistorySchema);
