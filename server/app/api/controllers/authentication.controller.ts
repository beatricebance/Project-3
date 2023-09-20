import { TYPES } from '../../domain/constants/types';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import {
  authLoginMiddleware,
  authRegisterMiddleware,
} from '../middleware/auth_middleware';
import { UserRepository } from '../../infrastructure/data_access/repositories/user_repository';
import { StatusService } from '../../domain/services/status.service';

@controller('/auth')
export class AuthenticationController {
  @inject(TYPES.UserRepository) public userRepository: UserRepository;
  @inject(TYPES.StatusService) public statusService: StatusService;

  @httpPost('/register', authRegisterMiddleware)
  public register() {}

  @httpPost('/login', authLoginMiddleware)
  public login() {}

  @httpPost('/logout')
  public logout(@request() req: Request, @response() res: Response) {
    this.userRepository.updateLogout(req.body.userId);
    this.statusService.setOffline(req.body.userId);
    req.logout();
    res.send(true);
  }
}
