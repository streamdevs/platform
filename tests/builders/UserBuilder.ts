import * as Factory from 'factory.ts';
import { random } from 'faker';

import { User } from '../../src/entities/User';

export const UserBuilder = Factory.Sync.makeFactory<User>({
	twitch: {
		bot: random.word(),
		channel: random.word(),
		token: random.word(),
	},

	streamLabs: {
		accessToken: random.word(),
	},
});
