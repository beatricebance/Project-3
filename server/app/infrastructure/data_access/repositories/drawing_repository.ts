import { Post, PostInterface } from '../../../domain/models/Post';
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { Drawing, DrawingInterface } from '../../../domain/models/Drawing';
import { Team, TeamInterface } from '../../../domain/models/teams';
import { User, UserInterface } from '../../../domain/models/user';
import { GenericRepository } from './generic_repository';

@injectable()
export class DrawingRepository extends GenericRepository<DrawingInterface> {
  constructor() {
    super(Drawing);
  }

  public async getPopulatedDrawings(): Promise<DrawingInterface[]> {
    return new Promise((resolve, reject) => {
      Drawing.find({})
        .populate('owner')
        .exec((err, drawings) => {
          if (err) {
            reject(drawings);
          }
          resolve(drawings);
        });
    });
  }

  public async getPopulatedDrawing(
    drawingId: string,
  ): Promise<DrawingInterface> {
    return new Promise((resolve, reject) => {
      Drawing.findOne({ _id: drawingId })
        .populate('owner')
        .exec((err, drawing) => {
          if (err || !drawing) {
            reject(err);
          }
          resolve(drawing!);
        });
    });
  }

  public async createUserDrawing(
    item: DrawingInterface,
    ownerId: string,
  ): Promise<DrawingInterface> {
    return new Promise<DrawingInterface>((resolve, reject) => {
      const drawing = new Drawing({
        dataUri: item.dataUri,
        owner: ownerId,
        ownerModel: 'User',
        name: item.name,
        privacyLevel: item.privacyLevel,
        password: item.password,
      });
      drawing.save().then((drawing) => {
        User.findById(
          { _id: drawing.owner },
          (err: Error, user: UserInterface) => {
            if (err) {
              reject(err);
            }
            user.drawings.push(drawing._id);
            user.save();
          },
        );
        Drawing.populate(drawing, { path: 'owner' }, (err, drawing) => {
          if (err || !drawing) {
            reject(err);
          }
          resolve(drawing);
        });
      });
    });
  }

  public async createTeamDrawing(
    item: DrawingInterface,
  ): Promise<DrawingInterface> {
    return new Promise<DrawingInterface>((resolve, reject) => {
      const drawing = new Drawing({
        dataUri: item.dataUri,
        owner: item.owner,
        ownerModel: item.ownerModel,
        name: item.name,
        privacyLevel: item.privacyLevel,
        password: item.password,
      });
      drawing.save().then((drawing) => {
        Team.findById(
          { _id: drawing.owner },
          (err: Error, team: TeamInterface) => {
            if (err) {
              reject(err);
            }
            team.drawings.push(drawing._id);
            team.save();
          },
        );
        Drawing.populate(drawing, { path: 'owner' }, (err, drawing) => {
          if (err || !drawing) {
            reject(err);
          }
          resolve(drawing);
        });
      });
    });
  }

  public async findManyDrawingsById(ids: string[]) {
    return new Promise<DrawingInterface[]>((resolve, reject) => {
      const query = { _id: { $in: ids } };
      Drawing.find(query as any)
        .populate('owner')
        .exec((err, drawings) => {
          if (err) {
            reject(err);
          }
          resolve(drawings);
        });
    });
  }

  public async findManyDrawingsByQuery(query: any) {
    return new Promise<DrawingInterface[]>((resolve, reject) => {
      Drawing.find(query as any)
        .populate('owner')
        .exec((err, drawings) => {
          if (err) {
            reject(err);
          }
          resolve(drawings);
        });
    });
  }

  public async publishDrawing(
    drawing: DrawingInterface,
  ): Promise<PostInterface> {
    return new Promise<PostInterface>((resolve, reject) => {
      const post = new Post({
        _id: new Types.ObjectId(),
        dataUri: drawing.dataUri,
        owner: drawing.owner,
        ownerModel: drawing.ownerModel,
        name: drawing.name,
      });
      post.save().then((createdPost) => {
        if (createdPost.ownerModel == 'Team') {
          Team.findById(
            { _id: createdPost.owner },
            (err: Error, team: TeamInterface) => {
              if (err || !team) {
                reject(err);
              }
              team.posts.push(createdPost._id);
              team.save();
            },
          );
        } else {
          User.findById(
            { _id: createdPost.owner },
            (err: Error, user: UserInterface) => {
              if (err || !user) {
                reject(err);
              }
              user.posts.push(createdPost._id);
              user.save();
            },
          );
        }
      });
      resolve(post);
    });
  }
}
