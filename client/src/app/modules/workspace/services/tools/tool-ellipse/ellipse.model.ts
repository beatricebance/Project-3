import { Tool } from "../tool.model";

export interface Ellipse extends Tool {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InProgressEllipse {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}