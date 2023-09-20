import { Drawing } from '../../../domain/models/Drawing';
import { Post } from '../../../domain/models/Post';
import { injectable } from 'inversify';
import { Team, TeamInterface } from '../../../domain/models/teams';
import { User, UserInterface } from '../../../domain/models/user';
import { GenericRepository } from './generic_repository';

@injectable()
export class TeamRepository extends GenericRepository<TeamInterface> {
  constructor() {
    super(Team);
  }

  public async getPopulatedTeams(): Promise<TeamInterface[]> {
    return new Promise((resolve, reject) => {
      Team.find({})
        .populate({ path: 'members' })
        .populate({ path: 'drawings', populate: { path: 'owner' } })
        .populate({ path: 'posts', populate: { path: 'owner' } })
        .exec((err, team) => {
          if (err) {
            reject(team);
          }
          resolve(team);
        });
    });
  }

  public async createTeam(team: TeamInterface): Promise<TeamInterface> {
    return new Promise<TeamInterface>((resolve, reject) => {
      const newTeam = new Team({
        name: team.name,
        description: team.description,
        owner: team.owner,
        memberLimit: team.memberLimit,
        isPrivate: team.isPrivate,
        password: team.password,
      });
      newTeam
        .save()
        .then((createdTeam: TeamInterface) => {
          (createdTeam.members as string[]).push(createdTeam.owner);
          createdTeam.save();

          User.findById(
            { _id: createdTeam.owner },
            (err: Error, user: UserInterface) => {
              if (err) {
                reject(err);
              }

              user.teams.push(createdTeam._id);
              user.save();
            },
          );

          resolve(createdTeam);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // For custom request

  public async getTeam(teamId: string) {
    return new Promise((resolve, reject) => {
      Team.findById({ _id: teamId })
        .populate(['members'])
        .populate({ path: 'drawings', populate: { path: 'owner' } })
        .populate({ path: 'posts', populate: { path: 'owner' } })
        .exec((err, team) => {
          if (err || !team) {
            reject(err);
          }
          resolve(team);
        });
    });
  }

  public async deleteTeam(teamId: string) {
    return new Promise((resolve, reject) => {
      Team.findOneAndDelete(
        { _id: teamId },
        (err: Error, deletedTeam: TeamInterface) => {
          if (err || !deletedTeam) {
            reject(err);
          }
          Drawing.deleteMany({ _id: { $in: deletedTeam.drawings } }, (err) => {
            if (err) {
              reject(err);
            }
          });
          Post.deleteMany({ _id: { $in: deletedTeam.posts } }, (err) => {
            if (err) {
              reject(err);
            }
          });
          resolve(deletedTeam);
        },
      );
    });
  }

  public async getTeamMembers(teamId: string) {
    return new Promise((resolve, reject) => {
      Team.findById({ _id: teamId })
        .populate(['members'])
        .exec((err, team) => {
          if (err || !team) {
            reject(err);
          }
          const allTeamMembers = team!.members;
          resolve(allTeamMembers);
        });
    });
  }

  public async addMemberToTeam(teamId: string, userId: string) {
    return new Promise((resolve, reject) => {
      Team.findById({ _id: teamId }, (err: Error, team: TeamInterface) => {
        if (err || !team) {
          reject(err);
        }

        (team.members as string[]).push(userId);
        team.save().then((team) => {
          User.findById({ _id: userId }, (err: Error, user: UserInterface) => {
            if (err || !user) {
              reject(err);
            }

            user.teams.push(team._id);
            user.save();
          });
          Team.populate(team, { path: 'members' }, (err, team) => {
            if (err || !team) {
              reject(team);
            }
            resolve(team);
          });
        });
      });
    });
  }

  public async removeMemberFromTeam(teamId: string, userId: string) {
    return new Promise((resolve, reject) => {
      Team.findByIdAndUpdate(
        { _id: teamId },
        { $pull: { members: { $in: userId } } },
        { new: true },
        (err: Error, team: TeamInterface) => {
          if (err) {
            reject(err);
          }
          User.findByIdAndUpdate(
            { _id: userId },
            { $pull: { teams: { $in: teamId } } },
            (err: Error, user: UserInterface) => {
              if (err) {
                reject(err);
              }
            },
          );
          Team.populate(team, { path: 'members' }, (err, team) => {
            if (err || !team) {
              reject(team);
            }
            resolve(team);
          });
        },
      );
    });
  }

  public async getTeamDrawings(teamId: string) {
    return new Promise((resolve, reject) => {
      Team.findById({ _id: teamId })
        .populate({ path: 'drawings', populate: { path: 'owner' } })
        .exec((err, team) => {
          if (err || !team) {
            reject(err);
          }
          resolve(team!.drawings);
        });
    });
  }

  public async getPosts(teamId: string) {
    return new Promise((resolve, reject) => {
      Team.findById({ _id: teamId })
        .populate({ path: 'posts', populate: { path: 'owner' } })
        .exec((err, team) => {
          if (err || !team) {
            reject(err);
          }
          resolve(team!.posts);
        });
    });
  }
}
