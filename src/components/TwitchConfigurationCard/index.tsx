import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	Link,
	Skeleton,
	Stack,
} from '@chakra-ui/react';
import * as firebase from 'firebase/app';
import { Suspense, useEffect, useState } from 'react';
import { useFirestoreDocData, useUser } from 'reactfire';

import { User } from '../../entities/User';
import { useFirestore } from '../../hooks/useFirestore';
import { Card } from '../Card';

type TwitchConfig = Pick<User, 'twitch'>;

const Content = () => {
	const [deleting, setDeleting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [newToken, setNewToken] = useState<string>('');
	const [newBot, setNewBot] = useState<string>('');
	const [newChannel, setNewChannel] = useState<string>('');

	const firestore = useFirestore();
	const user = useUser<firebase.User>();
	const twitchRef = firestore.doc(`users/${user?.uid}`);
	const { twitch } = useFirestoreDocData<TwitchConfig>(twitchRef);

	useEffect(() => {
		setNewToken(twitch?.token || '');
		setNewBot(twitch?.bot || '');
		setNewChannel(twitch?.channel || '');
	}, [twitch]);

	const onSave = async () => {
		setSaving(true);
		await twitchRef.set(
			{ twitch: { token: newToken, channel: newChannel, bot: newBot } },
			{ merge: true },
		);
		setSaving(false);
	};

	const onDelete = async () => {
		setDeleting(true);
		await twitchRef.set({ twitch: firebase.firestore.FieldValue.delete() }, { merge: true });
		setDeleting(false);
	};

	return (
		<>
			<Heading as="h2" size="md">
				{twitch?.token && twitch?.bot && twitch?.channel ? '✅' : '❌'} Twitch
			</Heading>
			<FormControl id="twitch-bot-name">
				<FormLabel>Bot name:</FormLabel>
				<InputGroup>
					<Input
						id="twitch-bot-name"
						type="text"
						value={newBot}
						onChange={(e) => setNewBot(e.target.value)}
					/>
				</InputGroup>
				<FormHelperText>
					The account (username) that the chatbot uses to send chat messages.
				</FormHelperText>
			</FormControl>
			<FormControl id="twitch-channel">
				<FormLabel>Channel:</FormLabel>
				<InputGroup>
					<Input
						id="twitch-channel"
						type="text"
						value={newChannel}
						onChange={(e) => setNewChannel(e.target.value)}
					/>
				</InputGroup>
				<FormHelperText>
					The Twitch channel name where you want to run the bot. Usually this is your main Twitch
					account.
				</FormHelperText>
			</FormControl>
			<FormControl id="twitch-token">
				<FormLabel>Token:</FormLabel>
				<InputGroup>
					<Input
						id="twitch-token"
						type="password"
						value={newToken}
						onChange={(e) => setNewToken(e.target.value)}
					/>
				</InputGroup>
				<FormHelperText>
					The token to authenticate your chatbot. Generate this with{' '}
					<Link href="https://twitchapps.com/tmi/" isExternal>
						https://twitchapps.com/tmi/
					</Link>
					, while logged in to your chatbot account. The token will be an alphanumeric string.
				</FormHelperText>
			</FormControl>
			<Stack direction="row" spacing={4} justify="flex-end">
				<Button variant="outline" onClick={onDelete} isLoading={deleting} loadingText="Deleing">
					Delete
				</Button>
				<Button onClick={onSave} isLoading={saving} loadingText="Saving">
					Save
				</Button>
			</Stack>
		</>
	);
};

export const TwitchConfigurationCard = () => {
	return (
		<Card>
			<Suspense
				fallback={
					<Stack>
						<Skeleton height="20px" />
						<Skeleton height="20px" />
						<Skeleton height="20px" />
					</Stack>
				}
			>
				<Content />
			</Suspense>
		</Card>
	);
};
