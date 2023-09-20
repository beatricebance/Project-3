import { Request } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  request,
} from 'inversify-express-utils';
import { TYPES } from '../../domain/constants/types';
import { DrawingRepository } from '../../infrastructure/data_access/repositories/drawing_repository';
import passport from 'passport';

@controller('/drawings', passport.authenticate('jwt', { session: false }))
export class DrawingController {
  @inject(TYPES.DrawingRepository) public drawingRepository: DrawingRepository;

  @httpGet('/')
  public async get() {
    return await this.drawingRepository.getPopulatedDrawings();
  }

  @httpGet('/:drawingId')
  public async getDrawingById(@request() req: Request) {
    return await this.drawingRepository.getPopulatedDrawing(
      req.params.drawingId,
    );
  }

  @httpPost('/')
  public async createDrawing(@request() req: Request) {
    return req.body.ownerModel === 'User'
      ? await this.drawingRepository.createUserDrawing(req.body, req.user!.id)
      : await this.drawingRepository.createTeamDrawing(req.body);
  }

  @httpPatch('/:drawingId')
  public async updateDrawing(@request() req: Request) {
    return await this.drawingRepository.updateById(
      req.params.drawingId,
      req.body,
    );
  }

  @httpPost('/:drawingId/publish')
  public async publishDrawing(@request() req: Request) {
    return await this.drawingRepository.publishDrawing(req.body);
  }
}
