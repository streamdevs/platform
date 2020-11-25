import {
	Button,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
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
			<InputGroup>
				<Input
					pr="9rem"
					type={'password'}
					value={newToken}
					onChange={(e) => setNewToken(e.target.value)}
				/>
				<InputRightElement width="9rem">
					<Stack spacing={1} direction="row" justify="right">
						<Button h="1.75rem" width="3.5rem" size="sm" onClick={onSave}>
							{saving ? 'Saving' : 'Save'}
						</Button>
						<Button h="1.75rem" width="3.5rem" size="sm" onClick={onDelete}>
							{deleting ? 'Deleting' : 'Delete'}
						</Button>
					</Stack>
				</InputRightElement>
			</InputGroup>
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
