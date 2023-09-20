import { ContainerModule } from 'inversify';
import { TYPES } from './domain/constants/types';
import {
  AvatarRepositoryInterface,
  DrawingRepositoryInterface,
  MessageRepositoryInterface,
  PostRepositoryInterface,
  TeamRepositoryInterface,
  TextChannelRepositoryInterface,
  UserRepositoryInterface,
} from './domain/interfaces/repository.interface';
import { SocketServiceInterface } from './domain/interfaces/socket.interface';
import { ChatSocketService } from './domain/services/sockets/chat-socket.service';
import { DrawingSocketService } from './domain/services/sockets/drawing-socket.service';
import { AvatarRepository } from './infrastructure/data_access/repositories/avatar_repository';
import { DrawingRepository } from './infrastructure/data_access/repositories/drawing_repository';
import { MessageRepository } from './infrastructure/data_access/repositories/message_repository';
import { TeamRepository } from './infrastructure/data_access/repositories/team_repository';
import { TextChannelRepository } from './infrastructure/data_access/repositories/text_channel_repository';
import { UserRepository } from './infrastructure/data_access/repositories/user_repository';
import { SearchService } from './domain/services/search.service';
import { PostRepository } from './infrastructure/data_access/repositories/post_repository';
import { CollaborationTrackerService } from './domain/services/collaboration-tracker.service';
import { StatusServiceInterface } from './domain/interfaces/status-service.interface';
import { StatusService } from './domain/services/status.service';

export const referenceDataIoCModule = new ContainerModule((bind) => {
  // Services
  bind<SocketServiceInterface>(TYPES.ChatSocketService)
    .to(ChatSocketService)
    .inSingletonScope();

  bind<DrawingSocketService>(TYPES.DrawingSocketService)
    .to(DrawingSocketService)
    .inSingletonScope();

  bind<CollaborationTrackerService>(TYPES.CollaborationTrackerService)
    .to(CollaborationTrackerService)
    .inSingletonScope();

  bind<SearchService>(TYPES.SearchService).to(SearchService).inSingletonScope();

  bind<StatusServiceInterface>(TYPES.StatusService)
    .to(StatusService)
    .inSingletonScope();

  // Repositories
  bind<UserRepositoryInterface>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  bind<TextChannelRepositoryInterface>(TYPES.TextChannelRepository)
    .to(TextChannelRepository)
    .inSingletonScope();

  bind<TeamRepositoryInterface>(TYPES.TeamRepository)
    .to(TeamRepository)
    .inSingletonScope();

  bind<DrawingRepositoryInterface>(TYPES.DrawingRepository)
    .to(DrawingRepository)
    .inSingletonScope();

  bind<PostRepositoryInterface>(TYPES.PostRepository)
    .to(PostRepository)
    .inSingletonScope();

  bind<MessageRepositoryInterface>(TYPES.MessageRepository)
    .to(MessageRepository)
    .inSingletonScope();

  bind<AvatarRepositoryInterface>(TYPES.AvatarRepository)
    .to(AvatarRepository)
    .inSingletonScope();
});
