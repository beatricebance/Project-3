import { StatusService } from '../../domain/services/status.service';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import passport from 'passport';
import { TYPES } from '../../domain/constants/types';
import { UserRepository } from '../../infrastructure/data_access/repositories/user_repository';

@controller('/users', passport.authenticate('jwt', { session: false }))
export class UserController {
  @inject(TYPES.UserRepository) public userRepository: UserRepository;
  @inject(TYPES.StatusService) public statusService: StatusService;

  @httpGet('/')
  public async get() {
    return await this.userRepository.findAll();
  }

  @httpGet('/me')
  public async getMe(@request() req: Request, @response() res: Response) {
    return await this.userRepository.getMe(req, res);
  }

  @httpGet('/status')
  public getUserStatus() {
    return this.statusService.getUserStatus();
  }

  @httpGet('/:id')
  public async getUserById(@request() req: Request) {
    return await this.userRepository.getPopulatedUser(req.params.id);
  }

  @httpGet('/:id/statistics')
  public async getUserStatistics(@request() req: Request) {
    return await this.userRepository.getUserStatistics(req.params.id);
  }

  @httpPost('/')
  public async createUser(@request() req: Request) {
    return await this.userRepository.create(req.body);
  }

  @httpPatch('/:id')
  public async updateUser(@request() req: Request) {
    return await this.userRepository.updateById(req.params.id, req.body);
  }

  @httpPatch('/:id/changePassword')
  public async changePassword(@request() req: Request) {
    return await this.userRepository.changePassword(
      req.params.id,
      req.body.currentPassword,
      req.body.newPassword,
    );
  }

  @httpDelete('/:id')
  public async deleteUser(@request() req: Request) {
    return await this.userRepository.deleteById(req.params.id);
  }

  @httpPost('/:id/followers/follow')
  public async followUser(@request() req: Request) {
    return await this.userRepository.followUser(req.params.id, req.user!.id);
  }

  @httpPost('/:id/followers/unfollow')
  public async unfolloweUser(@request() req: Request) {
    return await this.userRepository.unfollowUser(req.params.id, req.user!.id);
  }

  @httpGet('/:id/drawings')
  public async getDrawings(@request() req: Request) {
    return await this.userRepository.getUserDrawings(req.params.id);
  }

  @httpGet('/:id/posts')
  public async getPublishedDrawings(@request() req: Request) {
    return await this.userRepository.getPosts(req.params.id);
  }

  @httpGet('/:id/teams')
  public async getTeams(@request() req: Request) {
    return await this.userRepository.getUserTeams(req.params.id);
  }
}
