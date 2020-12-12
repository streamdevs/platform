import * as Factory from 'factory.ts';
import { date, internet } from 'faker';

import { GitEvent } from '../../src/entities/GitEvent';

export const GitEventBuilder = Factory.Sync.makeFactory<GitEvent>({
	sender: internet.userName(),
	timestamp: date.recent(),
});
