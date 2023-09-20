import { Avatar } from "src/app/shared/models/avatar.model";
import { CollaborationHistory } from "src/app/shared/models/collaboration-history.model";
import { Collaboration } from "src/app/shared/models/collaboration.model";
import { Drawing } from "src/app/shared/models/drawing.model";

export interface User {
  _id?: string;
  username?: string;
  avatar?: Avatar;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  description?: string;

  drawings?: string[] | Drawing[];
  lastLogin: Date;
  lastLogout: Date;

  collaborations: Collaboration[];
  collaborationHistory: CollaborationHistory[];
}
