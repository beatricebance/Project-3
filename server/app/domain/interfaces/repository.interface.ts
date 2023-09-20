import { UserInterface } from '../models/user';
import { TextChannelInterface } from '../models/TextChannel';
import { TeamInterface } from '../models/teams';
import { DrawingInterface } from '../models/Drawing';
import { MessageInterface } from '../models/Message';
import { AvatarInterface } from '../models/Avatar';
import { PostInterface } from '../models/Post';

export type Query<T> = {
  [P in keyof T]?: T[P] | { $regex: RegExp } | Date;
};

export interface Repository<T> {
  save(doc: T): Promise<T>;
  create(model: T): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  updateById(id: string, model: T): Promise<T>;
  deleteById(id: string): Promise<T>;
  findManyById(ids: string[]): Promise<T[]>;
  findManyByQuery(query?: Query<T>): Promise<T[]>;
}

export type UserRepositoryInterface = Repository<UserInterface>;
export type TeamRepositoryInterface = Repository<TeamInterface>;
export type DrawingRepositoryInterface = Repository<DrawingInterface>;
export type PostRepositoryInterface = Repository<PostInterface>;
export type TextChannelRepositoryInterface = Repository<TextChannelInterface>;
export type MessageRepositoryInterface = Repository<MessageInterface>;
export type AvatarRepositoryInterface = Repository<AvatarInterface>;
