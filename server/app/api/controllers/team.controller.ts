import { Request } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  request,
} from 'inversify-express-utils';
import passport from 'passport';
import { TYPES } from '../../domain/constants/types';
import { TeamRepository } from '../../infrastructure/data_access/repositories/team_repository';

@controller('/teams', passport.authenticate('jwt', { session: false }))
export class TeamController {
  @inject(TYPES.TeamRepository) public teamRepository: TeamRepository;

  @httpGet('/')
  public async get() {
    return await this.teamRepository.findAll();
  }

  @httpGet('/:teamId')
  public async getTeamById(@request() req: Request) {
    return await this.teamRepository.getTeam(req.params.teamId);
  }

  @httpPost('/')
  public async createTeam(@request() req: Request) {
    req.body.owner = req.user!.id;
    return await this.teamRepository.createTeam(req.body);
  }

  @httpPatch('/:teamId')
  public async updateTeam(@request() req: Request) {
    return await this.teamRepository.updateById(req.params.teamId, req.body);
  }

  @httpDelete('/:teamId')
  public async deleteTeam(@request() req: Request) {
    return await this.teamRepository.deleteTeam(req.params.teamId);
  }

  @httpGet('/:teamId/members')
  public async getTeamMembers(@request() req: Request) {
    return await this.teamRepository.getTeamMembers(req.params.teamId);
  }

  // Join a collaboration team
  @httpPost('/:teamId/join')
  public async addMemberToTeam(@request() req: Request) {
    return await this.teamRepository.addMemberToTeam(
      req.params.teamId,
      req.user!.id,
    );
  }

  @httpPost('/:teamId/leave')
  public async removeMemberFromTeam(@request() req: Request) {
    return await this.teamRepository.removeMemberFromTeam(
      req.params.teamId,
      req.user!.id,
    );
  }

  @httpGet('/:teamId/drawings')
  public async getTeamDrawings(@request() req: Request) {
    return await this.teamRepository.getTeamDrawings(req.params.teamId);
  }

  @httpGet('/:teamId/posts')
  public async getPosts(@request() req: Request) {
    return await this.teamRepository.getPosts(req.params.teamId);
  }
}
