import { Drawing } from "..";

export interface CollaborationHistory {
  _id: string;
  drawing: string | Drawing;
  collaboratedAt: Date;
}
