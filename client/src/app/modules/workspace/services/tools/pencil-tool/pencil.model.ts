import { Point } from "src/app/shared";
import { Tool } from "../tool.model";

export interface Pencil extends Tool {
  pointsList: Point[];
}

export interface InProgressPencil {
  id: string;
  point: Point;
}
