import * as admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import qs from 'qs';

import { Star } from '../../../reactions/github/star';
import { GitEventHistoryRepository } from '../../../repositories/GitEventHistoryRepository';
import { StreamLabs } from '../../../services/StreamLabs';
import { TwitchChat } from '../../../services/TwitchChat';

const app = admin.initializeApp();

export default nc<NextApiRequest, NextApiResponse>({
	onError: (err, req, res) => {
		console.log(err);

		res.status(500).end(JSON.stringify({ error: err.toString() }));
	},
}).post(async (req, res) => {
	const { token } = qs.parse(req.url.split('?')[1]);

	if (undefined === token) {
		res.status(400).end();
		return;
	}

	const userRef = app.firestore().doc(`/users/${token}`);
	const userDoc = await userRef.get();
	const user = userDoc.data();

	const streamLabs = new StreamLabs({ token: user.streamLabs.accessToken }, console);
	const twitchChat = new TwitchChat({
		botName: user.twitch.bot,
		channel: user.twitch.channel,
		botToken: user.twitch.token,
	});
	const gitEventHistoryRepository = new GitEventHistoryRepository();

	const starReaction = new Star(twitchChat, streamLabs, gitEventHistoryRepository);

	const payload = req.body;
	const event = req.headers['x-github-event']?.toString();

	if (starReaction.canHandle({ payload, event })) {
		res.json([await starReaction.handle({ payload: req.body, userId: token.toString() })]);
		return;
	}

	res.end();
});
