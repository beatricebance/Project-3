import { TYPES } from '../../domain/constants/types';
import { PostRepository } from '../../infrastructure/data_access/repositories/post_repository';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  request,
} from 'inversify-express-utils';
import { Request } from 'express';
import passport from 'passport';

@controller('/posts', passport.authenticate('jwt', { session: false }))
export class PostController {
  @inject(TYPES.PostRepository) public postRepository: PostRepository;

  @httpGet('/')
  public async getPosts() {
    return this.postRepository.getAllPopulatedPosts();
  }

  @httpGet('/featured')
  public async getPostsByFollowedUsers(@request() req: Request) {
    return this.postRepository.getFeaturedPosts(req.user!.id);
  }

  @httpGet('/:id')
  public async getPostById(@request() req: Request) {
    return this.postRepository.getPopulatedPostById(req.params.id);
  }

  @httpPost('/:id/comments')
  public async addComment(@request() req: Request) {
    return this.postRepository.addComment(
      req.user!.id,
      req.params.id,
      req.body,
    );
  }

  @httpPost('/:id/likes')
  public async addLike(@request() req: Request) {
    return this.postRepository.addLike(req.user!.id, req.params.id);
  }

  @httpDelete('/:id/likes')
  public async removeLIke(@request() req: Request) {
    return this.postRepository.removeLike(req.user!.id, req.params.id);
  }
}
