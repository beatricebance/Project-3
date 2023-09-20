import { TYPES } from '../../domain/constants/types';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import { AvatarRepository } from '../../infrastructure/data_access/repositories/avatar_repository';
import { Request, Response } from 'express';
import { upload } from '../middleware/upload_middleware';

@controller('/avatars')
export class AvatarController {
  @inject(TYPES.AvatarRepository) private avatarRepository: AvatarRepository;

  @httpGet('/')
  public async get() {
    return await this.avatarRepository.findAll();
  }

  @httpPost('/')
  public async postAvatar(@request() req: Request) {
    return await this.avatarRepository.create(req.body);
  }

  @httpPost('/upload', upload.single('avatar'))
  public async uploadAvatar(
    @request() req: Request,
    @response() res: Response,
  ) {
    if (req.file) {
      // HACK: Need to do casting as the imageUrl contained in req.file.location does not match the AvatarInterface
      const avatar = {
        imageUrl: (req.file as any).location,
      };
      return await this.avatarRepository.create(avatar as any);
    }
    return res.send(404).send('Failed to upload file');
  }

  @httpPost('/:id')
  public async deleteAvatar(@request() req: Request) {
    return await this.avatarRepository.deleteById(req.params.id);
  }

  @httpGet('/default')
  public async getDefaultAvatars() {
    return await this.avatarRepository.findManyByQuery({
      default: true,
    });
  }
}
