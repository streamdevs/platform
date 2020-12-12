import * as admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';

import { GitEventHistoryRepository } from '../../src/repositories/GitEventHistoryRepository';
import { GitEventBuilder } from '../builders/GitEventBuilder';

describe('GitEventHistoryRepository', () => {
	let app: admin.app.App;

	beforeEach(async () => {
		app = admin.initializeApp(undefined, 'test');
	});

	afterEach(async () => {
		await fetch(
			`http://localhost:8080/emulator/v1/projects/streamdevs-platform-prod/databases/(default)/documents`,
			{ method: 'DELETE' },
		);

		await Promise.all(admin.apps.map((app) => app.delete()));
	});

	describe('#findLastEventFromUser', () => {
		it("returns undefined if there aren't any events", async () => {
			const subject = new GitEventHistoryRepository();

			const event = await subject.findLastEventFromUser({
				userId: 'abc',
				repository: 'streamdevs/webhook',
				sender: 'SantiMA10',
				event: 'star',
			});

			expect(event).toEqual(undefined);
		});

		it('returns the expected event if there is one event', async () => {
			const newEvent = GitEventBuilder.build();
			const userId = 'abc';
			const repository = 'streamdevs/platform';
			const eventType = 'star';

			await app
				.firestore()
				.collection(`/events/${userId}-${encodeURIComponent(repository)}/${eventType}`)
				.add(newEvent);

			const subject = new GitEventHistoryRepository();

			const event = await subject.findLastEventFromUser({
				userId,
				repository,
				sender: newEvent.sender,
				event: eventType,
			});

			expect(event).toEqual(newEvent);
		});

		it('returns the last event if there are events multiple events', async () => {
			const expectedEvent = GitEventBuilder.build({ timestamp: new Date(), sender: 'SantiMA10' });
			const notExpectedEvent = GitEventBuilder.build({
				timestamp: new Date('2020-10-20'),
				sender: 'SantiMA10',
			});
			const userId = 'abc';
			const repository = 'streamdevs/platform';
			const eventType = 'star';
			const collection = `/events/${userId}-${encodeURIComponent(repository)}/${eventType}`;

			await app.firestore().collection(collection).add(expectedEvent);
			await app.firestore().collection(collection).add(notExpectedEvent);

			const subject = new GitEventHistoryRepository();

			const event = await subject.findLastEventFromUser({
				userId,
				repository,
				sender: expectedEvent.sender,
				event: eventType,
			});

			expect(event).toEqual(expectedEvent);
		});

		it('returns the last event if there are events multiple events', async () => {
			const expectedEvent = GitEventBuilder.build({
				timestamp: new Date('2020-10-20'),
				sender: 'SantiMA10',
			});
			const notExpectedEvent = GitEventBuilder.build({ timestamp: new Date() });
			const userId = 'abc';
			const repository = 'streamdevs/platform';
			const eventType = 'star';
			const collection = `/events/${userId}-${encodeURIComponent(repository)}/${eventType}`;

			await app.firestore().collection(collection).add(expectedEvent);
			await app.firestore().collection(collection).add(notExpectedEvent);

			const subject = new GitEventHistoryRepository();

			const event = await subject.findLastEventFromUser({
				userId,
				repository,
				sender: expectedEvent.sender,
				event: eventType,
			});

			expect(event).toEqual(expectedEvent);
		});
	});

	describe('#saveEvent', () => {
		it('returns the saved event', async () => {
			const expectedEvent = GitEventBuilder.build();
			const subject = new GitEventHistoryRepository();

			const event = await subject.saveEvent({
				userId: 'abc',
				repository: 'streamdevs/webhook',
				event: 'star',
				...expectedEvent,
			});

			expect(event).toEqual(expectedEvent);
		});

		it('stores in the db the event', async () => {
			const expectedEvent = GitEventBuilder.build();
			const subject = new GitEventHistoryRepository();

			await subject.saveEvent({
				userId: 'abc',
				repository: 'streamdevs/webhook',
				event: 'star',
				...expectedEvent,
			});

			expect(
				await subject.findLastEventFromUser({
					userId: 'abc',
					repository: 'streamdevs/webhook',
					event: 'star',
					sender: expectedEvent.sender,
				}),
			).toEqual(expectedEvent);
		});
	});
});
