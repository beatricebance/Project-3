import { Post, PostInterface } from '../../../domain/models/Post';
import { injectable } from 'inversify';
import { GenericRepository } from './generic_repository';
import { Comment, CommentInterface } from '../../../domain/models/Comment';
import { User, UserInterface } from '../../../domain/models/user';

@injectable()
export class PostRepository extends GenericRepository<PostInterface> {
  constructor() {
    super(Post);
  }

  public async getAllPopulatedPosts() {
    return new Promise((resolve, reject) => {
      Post.find({})
        .populate('owner')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .exec((err, posts) => {
          if (err || !posts) {
            reject(err);
          }
          resolve(posts);
        });
    });
  }

  public async getFeaturedPosts(currentUserId: string) {
    return new Promise((resolve, reject) => {
      User.findById({ _id: currentUserId })
        .populate({
          path: 'following',
          populate: { path: 'posts', populate: { path: 'comments' } },
        })
        .exec((err, user) => {
          if (err || !user) {
            reject(err);
          }
          const allPosts = [];

          for (let i = 0; i < user!.following.length; ++i) {
            let currentFollowing = user!.following[i] as UserInterface;
            for (let j = 0; j < currentFollowing.posts.length; ++j) {
              allPosts.push(currentFollowing.posts[j]);
            }
          }

          resolve(allPosts);
        });
    });
  }

  public async getPopulatedPostById(postId: string) {
    return new Promise((resolve, reject) => {
      Post.findById({ _id: postId })
        .populate({ path: 'comments', populate: { path: 'authorId' } })
        .exec((err, post) => {
          if (err || !post) {
            reject(err);
          }
          resolve(post);
        });
    });
  }

  public async addComment(
    userId: string,
    postId: string,
    comment: CommentInterface,
  ): Promise<PostInterface> {
    return new Promise<PostInterface>((resolve, reject) => {
      const newComment = new Comment({
        content: comment.content,
        author: userId,
        postId: postId,
      });
      newComment.save().then((savedComment) => {
        Post.findById({ _id: postId }, (err: Error, post: PostInterface) => {
          if (err || !post) {
            reject(err);
          }
          post.comments.push(savedComment._id);
          post.save();
          resolve(post);
        });
      });
    });
  }

  public async addLike(userId: string, postId: string) {
    return new Promise<PostInterface>((resolve, reject) => {
      Post.findByIdAndUpdate(
        { _id: postId },
        { $push: { likes: userId } },
        { new: true },
        (err: Error, post: PostInterface) => {
          if (err || !post) {
            reject(err);
          }
          resolve(post);
        },
      );
    });
  }

  public async removeLike(userId: string, postId: string) {
    return new Promise<PostInterface>((resolve, reject) => {
      Post.findByIdAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true },
        (err: Error, post: PostInterface) => {
          if (err || !post) {
            reject(err);
          }
          resolve(post);
        },
      );
    });
  }
}
