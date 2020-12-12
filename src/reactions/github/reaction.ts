import { GitEventHistoryRepository } from '../../repositories/GitEventHistoryRepository';
import { StreamLabs } from '../../services/StreamLabs';
import { TwitchChat } from '../../services/TwitchChat';
import { WebhookPayload } from './schemas/webhook-payload';

export interface IsValidOptions<P = WebhookPayload> {
	payload: P;
	userId: string;
}

export interface GetMessageOptions<P = WebhookPayload> {
	payload: P;
}

export interface NotifyOptions<P = WebhookPayload> {
	payload: P;
	userId: string;
}

export interface CanHandleOptions<P = WebhookPayload> {
	payload: P;
	event: string;
}

export interface HandleOptions<P = WebhookPayload> {
	payload: P;
	userId: string;
}

export interface ReactionStatus {
	notified: boolean;
	message: string;
}

type HandleReturn = {
	streamlabs: ReactionStatus;
	twitchChat: ReactionStatus;
};

export abstract class Reaction<P = WebhookPayload> {
	public constructor(
		private twitchChat: TwitchChat,
		private streamlabs: StreamLabs,
		protected gitEventHistoryRepository: GitEventHistoryRepository,
	) {}

	abstract getStreamLabsMessage(options: GetMessageOptions<P>): string;
	abstract getTwitchChatMessage(options: GetMessageOptions<P>): string;
	abstract canHandle(options: CanHandleOptions<P>): boolean;
	abstract isValid(options: IsValidOptions<P>): Promise<boolean>;

	private async notifyStreamlabs(options: NotifyOptions<P>): Promise<ReactionStatus> {
		const { payload } = options;

		if (!(await this.isValid(options))) {
			return {
				notified: false,
				message: '',
			};
		}

		try {
			const message = this.getStreamLabsMessage({ payload });
			await this.streamlabs.alert({
				message,
			});

			return {
				notified: true,
				message,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	private async notifyTwitch(options: NotifyOptions<P>): Promise<ReactionStatus> {
		const { payload } = options;

		if (!(await this.isValid(options))) {
			return {
				notified: false,
				message: '',
			};
		}

		try {
			const message = this.getTwitchChatMessage({ payload });
			await this.twitchChat.send(message);

			return {
				notified: true,
				message,
			};
		} catch {
			// TODO: add logging

			return {
				notified: false,
				message: '',
			};
		}
	}

	public async handle(options: HandleOptions<P>): Promise<HandleReturn> {
		const [streamlabs, twitchChat] = await Promise.all([
			this.notifyStreamlabs(options),
			this.notifyTwitch(options),
		]);

		return {
			twitchChat,
			streamlabs,
		};
	}
}
