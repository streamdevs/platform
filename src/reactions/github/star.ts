import * as admin from 'firebase-admin';
import { DateTime } from 'luxon';

import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { StarPayload } from './schemas/star-payload';

export class Star extends Reaction {
	canHandle({ payload, event }: ReactionCanHandleOptions<StarPayload>): boolean {
		return event === 'star' && payload.action === 'created';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<StarPayload>): string {
		return `*${payload.sender.login}* just starred *${payload.repository.full_name}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<StarPayload>): string {
		return `${payload.sender.login} just starred ${payload.repository.html_url}`;
	}

	public async isValid({
		userId,
		payload,
	}: {
		userId: string;
		payload: StarPayload;
	}): Promise<boolean> {
		const app = admin.initializeApp();
		const alreadySent = await app
			.firestore()
			.collection(`/events/${userId}-${encodeURIComponent(payload.repository.full_name)}/star`)
			.where('sender', '==', payload.sender.login)
			.orderBy('timestamp', 'desc')
			.limit(1)
			.get();

		return (
			alreadySent.empty ||
			DateTime.fromJSDate(alreadySent.docs[0].data().timestamp.toDate()) <
				DateTime.local().minus({ minutes: 5 })
		);
	}
}
