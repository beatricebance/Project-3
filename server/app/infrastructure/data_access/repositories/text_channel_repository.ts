import { TextChannel, TextChannelInterface } from '../../../domain/models/TextChannel';
import { injectable } from 'inversify';
import { GenericRepository } from './generic_repository';
import { Message, MessageInterface } from '../../../domain/models/Message';

@injectable()
export class TextChannelRepository extends GenericRepository<TextChannelInterface> {
	constructor() {
		super(TextChannel);
	}

	public async getMessages(channelId: string): Promise<MessageInterface[]> {
		return new Promise((resolve, reject) => {
			Message.find({ roomId: channelId })
			.exec((err, messages) => {
				if (err) {
					reject(err);
				}
				resolve(messages);
			})
		})
	};

	public async deleteMessages(channelId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			Message.deleteMany({ roomId: channelId })
			.exec((err) => {
				if (err) {
					reject(err);
				}
				resolve();
			})
		})
	};

	// Channels have unique names
	public async getChannelByName(channelName: string): Promise<TextChannelInterface> {
		return new Promise((resolve, reject) => {
			TextChannel.findOne({name: new RegExp('^'+ channelName +'$', "i")})
			.exec((err, channel) => {
				if (err || !channel) {
					reject(err);
				}
				resolve(channel!);
			})
		})
	}
}