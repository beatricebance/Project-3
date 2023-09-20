import { Point } from 'src/app/shared';
import { FilledShape } from '../tool-rectangle/filed-shape.model';

export interface Polygon extends FilledShape {
    pointsList: Point[];
}
