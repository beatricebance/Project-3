import { Point } from './point.interface';

export interface DrawingCommand {
  name: string;
  pointsList: Point[];
  strokeWidth: number;
  fill: string;
  stroke: string;
  fillOpacity: string;
  strokeOpacity: string;

  author: string;
  roomName: string;
}
