import { TYPES } from '../../domain/constants/types';
import { MessageRepository } from '../../infrastructure/data_access/repositories/message_repository';
import { Request } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
} from 'inversify-express-utils';
import passport from 'passport';

@controller('/messages', passport.authenticate('jwt', { session: false }))
export class MessageController {
  @inject(TYPES.MessageRepository) public messageRepository: MessageRepository;

  @httpGet('/')
  public async get() {
    return await this.messageRepository.findAll();
  }

  @httpGet('/:messageId')
  public async getMessageById(@request() req: Request) {
    return await this.messageRepository.findById(req.params.messageId);
  }

  @httpPost('/')
  public async createMessage(@request() req: Request) {
    return await this.messageRepository.create(req.body);
  }

  @httpPost('/')
  public async storeMessages(@request() req: Request) {
    return await this.messageRepository.storeMessages(req.body);
  }
}
