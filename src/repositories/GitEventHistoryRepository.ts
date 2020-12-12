import * as admin from 'firebase-admin';

import { GitEvent } from '../entities/GitEvent';

interface FinLastEventFromUserOptions {
	userId: string;
	repository: string;
	sender: string;
	event: string;
}

interface SaveEventOptions {
	userId: string;
	repository: string;
	sender: string;
	event: string;
	timestamp: Date;
}

type ReturnType = undefined | GitEvent;

export class GitEventHistoryRepository {
	private db: FirebaseFirestore.Firestore;

	public constructor() {
		if (admin.apps.length === 0) {
			this.db = admin.initializeApp().firestore();
		} else {
			this.db = admin.apps[0].firestore();
		}
	}

	public async findLastEventFromUser(opt: FinLastEventFromUserOptions): Promise<ReturnType> {
		const { userId, repository, event, sender } = opt;

		const response = await this.db
			.collection(`/events/${userId}-${encodeURIComponent(repository)}/${event}`)
			.where('sender', '==', sender)
			.orderBy('timestamp', 'desc')
			.limit(1)
			.get();

		if (response.empty) {
			return undefined;
		}

		const data = response.docs[0].data();

		return {
			sender: data.sender,
			timestamp: data.timestamp.toDate(),
		};
	}

	public async saveEvent(opt: SaveEventOptions): Promise<ReturnType> {
		const { userId, repository, event, sender, timestamp } = opt;

		await this.db
			.collection(`/events/${userId}-${encodeURIComponent(repository)}/${event}`)
			.add({ sender, timestamp });

		return {
			sender,
			timestamp,
		};
	}
}
