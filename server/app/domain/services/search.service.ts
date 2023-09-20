import { DrawingRepository } from '../../infrastructure/data_access/repositories/drawing_repository';
import { TeamRepository } from '../../infrastructure/data_access/repositories/team_repository';
import { UserRepository } from '../../infrastructure/data_access/repositories/user_repository';
import { injectable } from 'inversify';
import {
  drawingRepository,
  teamRepository,
  userRepository,
} from '../constants/decorators';
import { SearchServiceInterface } from '../interfaces/search-service.interface';
import { DrawingInterface } from '../models/Drawing';
import { TeamInterface } from '../models/teams';
import { UserInterface } from '../models/user';

const MONTH = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

@injectable()
export class SearchService implements SearchServiceInterface {
  @drawingRepository private drawingRepository: DrawingRepository;
  @teamRepository private teamRepository: TeamRepository;
  @userRepository private userRepository: UserRepository;

  async search(query: string): Promise<any> {
    const date = this.extractDate(query);

    const users = await this.userRepository.findManyByQuery({
      $or: [
        { username: { $regex: new RegExp(query, 'ig') } },
        { email: { $regex: new RegExp(query, 'ig') } },
        { firstName: { $regex: new RegExp(query, 'ig') } },
        { lastName: { $regex: new RegExp(query, 'ig') } },
      ],
    });

    const teams = await this.teamRepository.findManyByQuery({
      $or: [{ name: { $regex: new RegExp(query, 'ig') } }],
    });

    const matchingUsersDrawingsIds = this.getDrawingIds(users);
    const matchingTeamsDrawingsIds = this.getDrawingIds(teams);

    const matchingDrawingIds = [
      ...matchingUsersDrawingsIds,
      ...matchingTeamsDrawingsIds,
    ];

    const drawingsFromOwners =
      await this.drawingRepository.findManyDrawingsById(
        matchingDrawingIds as string[],
      );

    let drawingQuery: any = {
      $or: [{ name: { $regex: new RegExp(query, 'ig') } }],
    };

    if (date) {
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1);
      drawingQuery.$or.push({ createdAt: { $gte: date, $lte: endDate } });
    }

    const drawings = await this.drawingRepository.findManyDrawingsByQuery(
      drawingQuery,
    );

    return {
      users: [...users],
      teams: [...teams],
      drawings: this.removeDuplicates([...drawings, ...drawingsFromOwners]),
    };
  }

  private getDrawingIds(owners: UserInterface[] | TeamInterface[]) {
    return owners
      .map((owner) => owner.drawings)
      .reduce((p, c) => [...p, ...c], []);
  }

  private removeDuplicates(items: DrawingInterface[]): DrawingInterface[] {
    const uniqueDrawings = [];
    const hasSeen = new Set();

    const len = items.length;

    for (let i = 0; i < len; ++i) {
      const item = items[i];
      if (hasSeen.has(item._id.toString())) {
        continue;
      }
      uniqueDrawings.push(item);
      hasSeen.add(item._id.toString());
    }

    return uniqueDrawings;
  }

  private extractDate(query: string): Date | null {
    // Check if it's a month
    let month = null;
    if (query.toLowerCase() in MONTH) {
      month = MONTH[query];
      return new Date(2021, month);
    }

    return null;
  }
}
