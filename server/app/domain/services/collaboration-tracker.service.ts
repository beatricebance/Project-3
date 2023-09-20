import { injectable } from 'inversify';
import { Collaboration } from '../models/Collaboration';
import { User, UserInterface } from '../models/user';

@injectable()
export class CollaborationTrackerService {
  /**
   * Drawing ID         (UserId, Timestamp when person joined the session)
   * 32da789c78c9aw -> (89aw8caa9, 2019-10-2217:08UTC...)
   *                   (dwadw7adw, 2019-10-2218:07UTC...)
   * 372813278197aa -> ...
   */

  collaborationToUsersSession: Map<string, Map<string, Date>> = new Map<
    string,
    Map<string, Date>
  >();

  // This method is called when a user joins a session.
  // The timestamp is then stored and considered as their starting timestamp.
  onSessionJoin(drawingId: string, userId: string) {
    let drawingSession = this.collaborationToUsersSession.get(drawingId);
    if (!drawingSession) {
      drawingSession = this.collaborationToUsersSession
        .set(drawingId, new Map<string, Date>())
        .get(drawingId);
    }

    this.setUserSession(drawingSession!, userId);
  }

  onSessionLeave(drawingId: string, userId: string) {
    const joinTimestamp = this.collaborationToUsersSession
      .get(drawingId)
      ?.get(userId);

    if (!joinTimestamp) {
      return;
    }

    this.collaborationToUsersSession.get(drawingId)?.delete(userId);

    const timeSpent = new Date().getTime() - joinTimestamp.getTime();

    const timeSpentInMinutes = timeSpent / 60000;

    User.findOneAndUpdate(
      { _id: userId, collaborations: { $elemMatch: { drawing: drawingId } } },
      { $inc: { 'collaborations.$.timeSpent': timeSpentInMinutes } },
      { new: true, upsert: true },
      (err: Error, user: UserInterface) => {
        // Means we couldn't find it
        if (err) {
          const collaboration = new Collaboration({
            drawing: drawingId,
            timeSpent: timeSpentInMinutes,
          });
          User.findOneAndUpdate(
            { _id: userId },
            { $push: { collaborations: collaboration } },
            { new: true },
            (err: Error, user: UserInterface) => {
              if (err) {
                throw new Error('Failed to update');
              }
              return user;
            },
          );
        }
        return user;
      },
    );
  }

  private setUserSession(
    userToStartingDate: Map<string, Date>,
    userId: string,
  ) {
    userToStartingDate.set(userId, new Date());
  }
}
