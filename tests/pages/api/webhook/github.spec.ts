import http from 'http';
import fetch from 'isomorphic-unfetch';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import listen from 'test-listen';

import handler from '../../../../src/pages/api/webhook/github';

describe('/api/webhook/github', () => {
	describe('GET /api/webhook/github ', () => {
		let server: http.Server;
		let url: string;

		beforeAll(async () => {
			server = http.createServer((req, res) =>
				apiResolver(req, res, undefined, handler, undefined, undefined),
			);
			url = await listen(server);
		});

		afterAll((done) => {
			server.close(done);
		});

		it('returns a json with foo bar', async () => {
			const response = await fetch(url);

			expect(await response.json()).toEqual({ foo: 'bar' });
		});
	});
});
