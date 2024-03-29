import * as admin from 'firebase-admin';
import http from 'http';
import fetch from 'isomorphic-unfetch';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import listen from 'test-listen';

import handler from '../../../../src/pages/api/webhook/github';
import { StarPayload } from '../../../../src/reactions/github/schemas/star-payload';
import { StreamLabs } from '../../../../src/services/StreamLabs';
import { TwitchChat } from '../../../../src/services/TwitchChat';
import { UserBuilder } from '../../../builders/UserBuilder';

describe('/api/webhook/github', () => {
	describe('POST /api/webhook/github ', () => {
		let server: http.Server;
		let url: string;
		let spyStreamLabs: jest.SpyInstance<Promise<void>>;
		let spyTwitchChat: jest.SpyInstance<Promise<void>>;
		let app: admin.app.App;
		let payload: StarPayload;

		beforeAll(async () => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementation(jest.fn());

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementation(jest.fn());

			server = http.createServer((req, res) =>
				apiResolver(req, res, undefined, handler, undefined, undefined),
			);
			url = await listen(server);

			app = admin.initializeApp(undefined, 'test');

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

		beforeEach(async () => {
			await app.firestore().doc('/users/abc').set(UserBuilder.build());
		});

		afterEach(async () => {
			await fetch(
				`http://localhost:8080/emulator/v1/projects/streamdevs-platform-prod/databases/(default)/documents`,
				{ method: 'DELETE' },
			);
		});

		afterAll(async (done) => {
			await app.delete();

			server.close(done);
		});

		it("returns a 400 bad request if the url doesn't have a token", async () => {
			const response = await fetch(url, { method: 'POST' });

			expect(response.status).toEqual(400);
		});

		it('returns a 200 if the url contains a valid token', async () => {
			const response = await fetch(`${url}?token=abc`, { method: 'POST' });

			expect(response.status).toEqual(200);
		});

		it('returns the streamLab message', async () => {
			const response = await fetch(`${url}?token=abc`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'star',
				},
			});

			expect(await response.json()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						streamlabs: { notified: true, message: expect.any(String) },
					}),
				]),
			);
		});

		it('returns the twitch message', async () => {
			const response = await fetch(`${url}?token=abc`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
					'X-GitHub-Event': 'star',
				},
			});

			expect(await response.json()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						twitchChat: { notified: true, message: expect.any(String) },
					}),
				]),
			);
		});

		describe('cooldown', () => {
			it('prevent the same user to trigger the same event twice', async () => {
				const request = {
					method: 'POST',
					body: JSON.stringify(payload),
					headers: {
						'Content-Type': 'application/json',
						'X-GitHub-Event': 'star',
					},
				};

				await fetch(`${url}?token=abc`, request);
				const response = await fetch(`${url}?token=abc`, request);

				expect(await response.json()).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							streamlabs: { notified: false, message: expect.any(String) },
							twitchChat: { notified: false, message: expect.any(String) },
						}),
					]),
				);
			});
		});
	});
});
