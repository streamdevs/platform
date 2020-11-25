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

import { useFirestore } from '../../hooks/useFirestore';
import { Card } from '../Card';

const Content = () => {
	const [deleting, setDeleting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [newToken, setNewToken] = useState<string>('');

	const firestore = useFirestore();
	const user = useUser<firebase.User>();
	const streamLabsRef = firestore.doc(`users/${user?.uid}`);
	const { streamLabs } = useFirestoreDocData<{ streamLabs?: { accessToken: string } }>(
		streamLabsRef,
	);

	useEffect(() => {
		setNewToken(streamLabs?.accessToken || '');
	}, [streamLabs]);

	const onSave = async () => {
		setSaving(true);
		await streamLabsRef.set({ streamLabs: { accessToken: newToken } }, { merge: true });
		setSaving(false);
	};

	const onDelete = async () => {
		setDeleting(true);
		await streamLabsRef.set(
			{ streamLabs: firebase.firestore.FieldValue.delete() },
			{ merge: true },
		);
		setDeleting(false);
	};

	return (
		<>
			<Heading as="h2" size="md">
				{streamLabs ? '✅' : '❌'} StreamLabs Token
			</Heading>
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
					A token to use the StreamLabs API. You can get one by using{' '}
					<Link href="https://github.com/streamdevs/streamlabs-token" isExternal>
						StreamDevs/streamlabs-token
					</Link>
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

export const StreamLabsConfigurationCard = () => {
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
