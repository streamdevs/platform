import http from 'http';
import fetch from 'isomorphic-unfetch';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import listen from 'test-listen';

import handler from '../../../../src/pages/api/webhook/github';
import { StreamLabs } from '../../../../src/services/StreamLabs';
import { TwitchChat } from '../../../../src/services/TwitchChat';

describe('/api/webhook/github', () => {
	describe('POST /api/webhook/github ', () => {
		let server: http.Server;
		let url: string;
		let spyStreamLabs: jest.SpyInstance<Promise<void>>;
		let spyTwitchChat: jest.SpyInstance<Promise<void>>;

		beforeAll(async () => {
			spyStreamLabs = jest.spyOn(StreamLabs.prototype, 'alert');
			spyStreamLabs.mockImplementation(jest.fn());

			spyTwitchChat = jest.spyOn(TwitchChat.prototype, 'send');
			spyTwitchChat.mockImplementation(jest.fn());

			server = http.createServer((req, res) =>
				apiResolver(req, res, undefined, handler, undefined, undefined),
			);
			url = await listen(server);
		});

		afterAll((done) => {
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
				body: JSON.stringify({
					action: 'created',
					repository: {
						full_name: 'streamdevs/webhook',
						html_url: 'https://github.com/streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				}),
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
				body: JSON.stringify({
					action: 'created',
					repository: {
						full_name: 'streamdevs/webhook',
						html_url: 'https://github.com/streamdevs/webhook',
					},
					sender: {
						login: 'orestes',
					},
				}),
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
	});
});
