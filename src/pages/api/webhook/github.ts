import * as admin from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import qs from 'qs';

import { Star } from '../../../reactions/github/star';
import { StreamLabs } from '../../../services/StreamLabs';
import { TwitchChat } from '../../../services/TwitchChat';

const app = admin.initializeApp();

export default nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
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

	const starReaction = new Star(twitchChat, streamLabs);

	res.json([await starReaction.handle({ payload: req.body })]);
});
