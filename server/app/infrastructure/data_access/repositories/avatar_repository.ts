import { Avatar, AvatarInterface } from '../../../domain/models/Avatar';
import { injectable } from 'inversify';
import { GenericRepository } from './generic_repository';

@injectable()
export class AvatarRepository extends GenericRepository<AvatarInterface> {
  constructor() {
    super(Avatar);
  }
}
