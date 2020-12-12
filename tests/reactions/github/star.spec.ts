import { StreamLabsMock } from '../../__mocks__/StreamLabs';
import { TwitchChatMock } from '../../__mocks__/TwitchChat';
import { StarPayload } from '../../../src/reactions/github/schemas/star-payload';
import { Star } from '../../../src/reactions/github/star';
import { GitEventHistoryRepository } from '../../../src/repositories/GitEventHistoryRepository';
import { GitEventBuilder } from '../../builders/GitEventBuilder';

const testBuilder = () => {
	const twitchChat: TwitchChatMock = new TwitchChatMock();
	const streamlabs: StreamLabsMock = new StreamLabsMock();
	const gitEventHistoryRepository: GitEventHistoryRepository = ({
		findLastEventFromUser: jest.fn(),
		saveEvent: jest.fn(),
	} as undefined) as GitEventHistoryRepository;

	const subject = new Star(twitchChat, streamlabs, gitEventHistoryRepository);

	return { twitchChat, streamlabs, gitEventHistoryRepository, subject };
};

describe('Star', () => {
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

		describe('dealing with TwitchChat', () => {
			it("returns 'notified' set to false if something goes wrong", async () => {
				const { twitchChat, subject } = testBuilder();
				twitchChat.send.mockImplementationOnce(async () => {
					throw new Error('boom');
				});

				const {
					twitchChat: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(false);
			});

			it("returns the 'message' and 'notified' set to true", async () => {
				const { subject } = testBuilder();

				const { twitchChat: response } = await subject.handle({ payload, userId: 'abc' });

				expect(response).toEqual({
					message: `${payload.sender.login} just starred ${payload.repository.html_url}`,
					notified: true,
				});
			});

			it("returns 'notified' set to false if the sender is a spammer", async () => {
				const { subject, gitEventHistoryRepository } = testBuilder();
				jest
					.spyOn(gitEventHistoryRepository, 'findLastEventFromUser')
					.mockImplementation(async () =>
						GitEventBuilder.build({ sender: payload.sender.login, timestamp: new Date() }),
					);

				const {
					twitchChat: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(false);
			});

			it("returns 'notified' set to true if user sender has an event older than 5 minutes", async () => {
				const { subject, gitEventHistoryRepository } = testBuilder();
				jest
					.spyOn(gitEventHistoryRepository, 'findLastEventFromUser')
					.mockImplementation(async () =>
						GitEventBuilder.build({
							sender: payload.sender.login,
							timestamp: new Date('2020-10-20'),
						}),
					);

				const {
					twitchChat: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(true);
			});
		});

		describe("dealing with 'StreamLabs'", () => {
			it("returns 'notified' set to false if something goes wrong", async () => {
				const { subject, streamlabs } = testBuilder();
				streamlabs.alert.mockImplementationOnce(async () => {
					throw new Error('boooom');
				});

				const {
					streamlabs: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(false);
			});

			it("returns the 'message' and 'notified' set to true", async () => {
				const { subject } = testBuilder();

				const { streamlabs: response } = await subject.handle({ payload, userId: 'abc' });

				expect(response).toEqual({
					notified: true,
					message: `*${payload.sender.login}* just starred *${payload.repository.full_name}*`,
				});
			});

			it("returns 'notified' set to false if the sender is a spammer", async () => {
				const { subject, gitEventHistoryRepository } = testBuilder();
				jest
					.spyOn(gitEventHistoryRepository, 'findLastEventFromUser')
					.mockImplementation(async () =>
						GitEventBuilder.build({ sender: payload.sender.login, timestamp: new Date() }),
					);

				const {
					streamlabs: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(false);
			});

			it("returns 'notified' set to true if user sender has an event older than 5 minutes", async () => {
				const { subject, gitEventHistoryRepository } = testBuilder();
				jest
					.spyOn(gitEventHistoryRepository, 'findLastEventFromUser')
					.mockImplementation(async () =>
						GitEventBuilder.build({
							sender: payload.sender.login,
							timestamp: new Date('2020-10-20'),
						}),
					);

				const {
					streamlabs: { notified },
				} = await subject.handle({ payload, userId: 'abc' });

				expect(notified).toEqual(true);
			});
		});
	});

	describe('#canHandle', () => {
		it('returns true if the event is star and actions is created', () => {
			const { subject } = testBuilder();

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'created' } as StarPayload,
			});

			expect(result).toEqual(true);
		});

		it('returns false if the event is star and actions is removed', () => {
			const { subject } = testBuilder();

			const result = subject.canHandle({
				event: 'star',
				payload: { action: 'removed' } as StarPayload,
			});

			expect(result).toEqual(false);
		});
	});
});
