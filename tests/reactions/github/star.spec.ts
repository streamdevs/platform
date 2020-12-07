import * as admin from 'firebase-admin';
import fetch from 'isomorphic-unfetch';

import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { StarPayload } from '../../../src/reactions/github/schemas/star-payload';
import { Star } from '../../../src/reactions/github/star';

describe('Star', () => {
	let twitchChat: TwitchChatMock;
	let streamlabs: StreamLabsMock;

	beforeEach(() => {
		twitchChat = new TwitchChatMock();
		streamlabs = new StreamLabsMock();
	});

	describe('#handle', () => {
		let payload: StarPayload;

		beforeEach(() => {
			payload = {
				action: 'created',
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};
		});

		it("returns 'twitchChat.notified' set to false if something goes wrong in TwitchChat ", async () => {
			twitchChat.send.mockImplementationOnce(async () => {
				throw new Error('boom');
			});
			const subject = new Star(twitchChat, streamlabs);

			const {
				twitchChat: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'twitchChat' with the message send to Twitch and notified set to true", async () => {
			const subject = new Star(twitchChat, streamlabs);

			const { twitchChat: response } = await subject.handle({ payload });

			expect(response).toEqual({
				message: `${payload.sender.login} just starred ${payload.repository.html_url}`,
				notified: true,
			});
		});

		it("returns 'streamlabs.notified' set to false if something goes wrong with StreamLabs", async () => {
			streamlabs.alert.mockImplementationOnce(async () => {
				throw new Error('boooom');
			});
			const subject = new Star(twitchChat, streamlabs);

			const {
				streamlabs: { notified },
			} = await subject.handle({ payload });

			expect(notified).toEqual(false);
		});

		it("returns 'streamlabs' with the message send to StreamLabs and notified set to true", async () => {
			const subject = new Star(twitchChat, streamlabs);

			const { streamlabs: response } = await subject.handle({ payload });

			expect(response).toEqual({
				notified: true,
				message: `*${payload.sender.login}* just starred *${payload.repository.full_name}*`,
			});
		});
	});

	describe('#canHandle', () => {
		it('returns true if the event is star and actions is created', () => {
			const subject = new Star(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'created' } as StarPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is star and actions is removed', () => {
			const subject = new Star(twitchChat, streamlabs);

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'removed' } as StarPayload,
			});

			expect(result).toEqual(false);
		});
	});

	describe('#isValid', () => {
		let payload: StarPayload;
		let app: admin.app.App;

		beforeEach(async () => {
			payload = {
				action: 'created',
				repository: {
					full_name: 'streamdevs/webhook',
					html_url: 'https://github.com/streamdevs/webhook',
				},
				sender: {
					login: 'orestes',
				},
			};

			app = admin.initializeApp(undefined, 'test');
		});

		afterEach(async () => {
			await fetch(
				`http://localhost:8080/emulator/v1/projects/streamdevs-platform-prod/databases/(default)/documents`,
				{ method: 'DELETE' },
			);

			await Promise.all(admin.apps.map((app) => app.delete()));
		});

		it('returns false if the user how send the star is a spammer', async () => {
			const userId = 'abc';
			await app
				.firestore()
				.collection(`/events/${userId}-${encodeURIComponent(payload.repository.full_name)}/star`)
				.add({ sender: payload.sender.login, timestamp: new Date() });

			const subject = new Star(twitchChat, streamlabs);

			expect(await subject.isValid({ userId, payload })).toEqual(false);
		});

		it("returns true if the user how send the star isn't a spammer", async () => {
			const userId = 'abc';

			const subject = new Star(twitchChat, streamlabs);

			expect(await subject.isValid({ userId, payload })).toEqual(true);
		});

		it("returns true if the user how send the star isn't a spammer because their message is from more than 5 minutes ago", async () => {
			const userId = 'abc';
			await app
				.firestore()
				.collection(`/events/${userId}-${encodeURIComponent(payload.repository.full_name)}/star`)
				.add({ sender: payload.sender.login, timestamp: new Date('2020-10-20') });

			const subject = new Star(twitchChat, streamlabs);

			expect(await subject.isValid({ userId, payload })).toEqual(true);
		});

		it('returns false if the user how send the star is a spammer', async () => {
			const userId = 'abc';
			await app
				.firestore()
				.collection(`/events/${userId}-${encodeURIComponent(payload.repository.full_name)}/star`)
				.add({ sender: payload.sender.login, timestamp: new Date('2020-10-20') });
			await app
				.firestore()
				.collection(`/events/${userId}-${encodeURIComponent(payload.repository.full_name)}/star`)
				.add({ sender: payload.sender.login, timestamp: new Date() });

			const subject = new Star(twitchChat, streamlabs);

			expect(await subject.isValid({ userId, payload })).toEqual(false);
		});
	});
});
