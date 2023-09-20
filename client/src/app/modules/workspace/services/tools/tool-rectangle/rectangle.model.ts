import { Tool } from "../tool.model";

export interface Rectangle extends Tool {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InProgressRectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
