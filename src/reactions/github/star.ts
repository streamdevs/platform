import { DateTime } from 'luxon';

import {
	CanHandleOptions,
	GetMessageOptions,
	HandleOptions,
	IsValidOptions,
	Reaction,
} from './reaction';
import { StarPayload } from './schemas/star-payload';

export class Star extends Reaction {
	public canHandle({ payload, event }: CanHandleOptions<StarPayload>): boolean {
		return event === 'star' && payload.action === 'created';
	}

	protected getStreamLabsMessage({ payload }: GetMessageOptions<StarPayload>): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	protected getTwitchChatMessage({ payload }: GetMessageOptions<StarPayload>): string {
		return `${payload.sender.login} just starred ${payload.repository.html_url}`;
	}

	public async isValid(options: IsValidOptions<StarPayload>): Promise<boolean> {
		const { userId, payload } = options;

		const event = await this.gitEventHistoryRepository.findLastEventFromUser({
			userId,
			repository: options.payload.repository.full_name,
			event: 'star',
			sender: payload.sender.login,
		});

		return !event || DateTime.fromJSDate(event.timestamp) < DateTime.local().minus({ minutes: 5 });
	}

	public async handle(options: HandleOptions<StarPayload>) {
		const response = await super.handle(options);
		await this.gitEventHistoryRepository.saveEvent({
			event: 'star',
			repository: options.payload.repository.full_name,
			sender: options.payload.sender.login,
			timestamp: new Date(),
			userId: options.userId,
		});

		return response;
	}
}
