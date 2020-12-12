import { DateTime } from 'luxon';

import { CanHandleOptions, GetMessageOptions, IsValidOptions, Reaction } from './reaction';
import { StarPayload } from './schemas/star-payload';

export class Star extends Reaction {
	canHandle({ payload, event }: CanHandleOptions<StarPayload>): boolean {
		return event === 'star' && payload.action === 'created';
	}

	getStreamLabsMessage({ payload }: GetMessageOptions<StarPayload>): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: GetMessageOptions<StarPayload>): string {
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
}
